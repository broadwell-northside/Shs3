// POST /api/quote: emails a quote request to SHS & Improvements via Resend (https://resend.com).
//
// Environment variables (Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY    required  Resend API key (starts with "re_")
//   QUOTE_TO_EMAIL    required  Inbox that receives leads. Comma-separate several addresses.
//   QUOTE_FROM_EMAIL  optional  Sender, e.g. "SHS Website <quotes@shsimprove.com>".
//                               Needs a domain verified in Resend. Until then the default
//                               "onboarding@resend.dev" sender only delivers to the email
//                               address that owns the Resend account.

const SERVICES = [
  'Siding',
  'Exterior painting',
  'Decks, pergolas & enclosed porches',
  'Roofing & gutters',
  'Kitchen & bath remodeling',
  'Landscape & outdoor design',
  'Something else',
];
const LIMITS = { name: 100, phone: 30, email: 200, address: 200, details: 3000 };

// Best-effort abuse guard (per server instance): 5 requests per IP per 10 minutes.
const hits = new Map();
const rateLimited = ip => {
  const now = Date.now(), windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = v => (typeof v === 'string' ? v.trim() : '');

function validate(body) {
  const d = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    address: clean(body.address),
    service: clean(body.service),
    details: clean(body.details),
  };
  const errors = {};
  if (d.name.length < 2) errors.name = 'Enter your name.';
  if (d.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a phone number with at least 10 digits.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) errors.email = 'Enter an email address like name@example.com.';
  if (!SERVICES.includes(d.service)) errors.service = 'Choose the service you need.';
  for (const [k, max] of Object.entries(LIMITS)) if (d[k].length > max) errors[k] = `Please keep this under ${max} characters.`;
  return { d, errors };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, error: 'bad_request' });

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots move on.
  if (clean(body._gotcha)) return res.status(200).json({ ok: true });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: 'rate_limited' });

  const { d, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, error: 'invalid', fields: errors });

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.QUOTE_TO_EMAIL || '').split(',').map(s => s.trim()).filter(Boolean);
  const from = process.env.QUOTE_FROM_EMAIL || 'SHS Website <onboarding@resend.dev>';
  if (!apiKey || !to.length) {
    console.error('Quote form is not configured: set RESEND_API_KEY and QUOTE_TO_EMAIL in Vercel.');
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const rows = [
    ['Name', d.name],
    ['Phone', d.phone],
    ['Email', d.email],
    ['Address / ZIP', d.address || '-'],
    ['Service', d.service],
    ['Project details', d.details || '-'],
  ];
  const telHref = 'tel:' + d.phone.replace(/[^\d+]/g, '');
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#EEF0EB;font-family:Arial,Helvetica,sans-serif;color:#18232D">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#18232D;color:#fff;padding:20px 24px;font-size:20px;font-weight:bold">New quote request: ${esc(d.service)}</td></tr>
    <tr><td style="padding:8px 24px 0">
      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:15px;line-height:1.5">
        ${rows.map(([k, v]) => `<tr><td style="padding:10px 12px 10px 0;color:#56616B;vertical-align:top;white-space:nowrap;border-bottom:1px solid #EEF0EB">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #EEF0EB;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}
      </table>
    </td></tr>
    <tr><td style="padding:20px 24px 24px">
      <a href="${esc(telHref)}" style="display:inline-block;background:#D2953A;color:#18232D;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:999px">Call ${esc(d.name.split(' ')[0])}</a>
      <span style="color:#56616B;font-size:13px;margin-left:12px">Reply to this email to answer ${esc(d.email)}</span>
    </td></tr>
  </table>
  <p style="text-align:center;color:#56616B;font-size:12px">Sent from the quote form on the SHS &amp; Improvements website.</p>
</body></html>`;
  const text = 'New quote request from the SHS & Improvements website\n\n' + rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  const idempotencyKey = clean(body.requestId).slice(0, 100);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': `quote-${idempotencyKey}` } : {}),
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: d.email,
        subject: `New quote request: ${d.service} (${d.name})`,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, (await r.text()).slice(0, 500));
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Resend request failed', e && e.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
