// Build: render content/*.js into index.html, compile Tailwind, copy the site to dist/.
// Run locally with `npm run build`. Vercel runs it on every push.
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const load = rel => { const p = path.join(ROOT, rel); delete require.cache[p]; return require(p); };
const photos = load('content/photos.js');
const reviews = load('content/reviews.js');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const problems = [];
const checkImage = (src, where) => {
  if (!src) { problems.push(`${where}: missing "src"`); return; }
  if (!src.startsWith('/images/')) { problems.push(`${where}: "${src}" should start with /images/`); return; }
  if (!existsSync(path.join(ROOT, src))) problems.push(`${where}: file not found: ${src}`);
};

const CATEGORIES = { siding: 'Siding', decks: 'Decks', porch: 'Porch enclosures', roofing: 'Roofing', paint: 'Paint' };
const PH = label => `<span class="ph">${esc(label)}</span>`;

// ---------- Fixed photo slots ----------
checkImage(photos.hero?.src, 'hero');
if (photos.hero?.srcMobile) checkImage(photos.hero.srcMobile, 'hero.srcMobile');
checkImage(photos.why?.src, 'why');
checkImage(photos.about?.src, 'about');

const heroMobile = photos.hero.srcMobile || photos.hero.src;
const blocks = {
  preload: `<link rel="preload" as="image" href="${esc(photos.hero.src)}" imagesrcset="${esc(heroMobile)} 900w, ${esc(photos.hero.src)} 1920w" imagesizes="100vw">`,
  hero: `<picture>
        <source media="(max-width: 767px)" srcset="${esc(heroMobile)}">
        <img src="${esc(photos.hero.src)}" alt="${esc(photos.hero.alt)}" class="hero-img absolute inset-0 -z-10 h-full w-full object-cover object-[60%_center]" fetchpriority="high" decoding="async">
      </picture>`,
  heroTag: photos.hero.placeholder ? `<span class="ph !top-auto !bottom-3 !left-auto right-3">Placeholder photo</span>` : '',
  why: `<img src="${esc(photos.why.src)}" alt="${esc(photos.why.alt)}" class="absolute inset-0 w-full h-full object-cover" decoding="async">
          ${photos.why.placeholder ? PH('Placeholder photo') : ''}`,
  about: `<img src="${esc(photos.about.src)}" alt="${esc(photos.about.alt)}" class="absolute inset-0 w-full h-full object-cover" decoding="async">
            ${photos.about.placeholder ? PH(photos.about.placeholderLabel || 'Placeholder photo') : ''}`,
};

// ---------- Gallery + before/after ----------
const gallery = photos.gallery || [];
gallery.forEach((g, i) => {
  checkImage(g.src, `gallery[${i}]`);
  if (!CATEGORIES[g.category]) problems.push(`gallery[${i}]: category "${g.category}" must be one of ${Object.keys(CATEGORIES).join(', ')}`);
  if (!g.alt) problems.push(`gallery[${i}]: add an "alt" description`);
});
const pairs = photos.beforeAfter || [];
pairs.forEach((p, i) => { checkImage(p.before, `beforeAfter[${i}].before`); checkImage(p.after, `beforeAfter[${i}].after`); });

const anyPlaceholder = gallery.some(g => g.placeholder);
const knob = `<div class="handle"><span class="knob"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 6-6 6 6 6M15 6l6 6-6 6"/></svg></span></div>`;
const pairHtml = (p, i) => `
          <figure>
            <div class="ba aspect-[4/3] rounded-md bg-ink-2" style="--pos:50%" data-ba>
              <img src="${esc(p.after)}" alt="After: ${esc(p.alt)}" loading="lazy" decoding="async">
              <img class="before" src="${esc(p.before)}" alt="Before: ${esc(p.alt)}" loading="lazy" decoding="async">
              ${knob}
              <span class="absolute bottom-3 left-3 z-[3] rounded-[3px] bg-white/90 text-ink text-xs font-semibold px-2.5 py-1">Before</span>
              <span class="absolute bottom-3 right-3 z-[3] rounded-[3px] bg-brass-light text-ink text-xs font-semibold px-2.5 py-1">After</span>
              <input type="range" min="0" max="100" value="50" aria-label="Before and after comparison: ${esc(p.title || 'project ' + (i + 1))}">
            </div>
            <figcaption class="mt-3 font-medium text-lg">${esc(p.title || '')}${p.detail ? ` <span class="font-normal text-slatey">· ${esc(p.detail)}</span>` : ''}</figcaption>
          </figure>`;

const present = Object.keys(CATEGORIES).filter(c => gallery.some(g => g.category === c));
const filterBtn = (key, label, on) => `
          <button type="button" class="shrink-0 h-11 mr-6 font-medium text-[0.95rem] border-b-2 ${on ? 'border-ink text-ink' : 'border-transparent text-slatey hover:text-ink'}" aria-pressed="${on}" data-filter="${key}">${esc(label)}</button>`;

const tile = g => {
  const label = CATEGORIES[g.category] || '';
  const li = g.size === 'large' ? 'gal-item col-span-2 row-span-2' : g.size === 'wide' ? 'gal-item col-span-2' : 'gal-item';
  const btn = g.size === 'large' ? 'h-full min-h-[260px]' : g.size === 'wide' ? 'h-full aspect-[2/1] lg:aspect-auto' : 'aspect-square';
  return `
          <li class="${li}" data-cat="${esc(g.category)}">
            <button type="button" class="group relative block w-full ${btn} overflow-hidden rounded-md bg-ink-2" data-lightbox aria-label="View larger: ${esc(g.alt)}">
              <img src="${esc(g.src)}" alt="${esc(g.alt)}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" loading="lazy" decoding="async">
              ${g.placeholder ? PH('Placeholder') : ''}
              <span class="absolute inset-x-0 bottom-0 p-4 text-left bg-gradient-to-t from-ink/85 to-transparent text-white font-medium">${esc(g.caption || label)}</span>
            </button>
          </li>`;
};

blocks.work = `<div class="reveal flex flex-col lg:flex-row lg:items-end gap-6 justify-between mb-10">
          <div>
            <h2 id="work-title" class="display text-[2.1rem] sm:text-[2.75rem] lg:text-[3.25rem]">Our work</h2>
            <p class="mt-4 text-lg text-slatey max-w-[36rem] leading-relaxed">${pairs.length ? 'Drag the sliders to compare before and after, or tap any photo to see it full size.' : 'Tap any photo to see it full size.'}</p>
          </div>
          ${anyPlaceholder ? '<p class="text-sm text-slatey max-w-[24rem] lg:text-right">Photos shown are placeholders until real SHS project photos are added.</p>' : ''}
        </div>
${pairs.length ? `        <div class="grid ${pairs.length > 1 ? 'md:grid-cols-2' : 'max-w-3xl'} gap-5 mb-12">${pairs.map(pairHtml).join('')}
        </div>` : '        <!-- Before/after sliders appear here when pairs are added in content/photos.js -->'}
${present.length > 1 ? `        <div style="overflow-x:auto" class="flex overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-ink/10 [scrollbar-width:none]" role="group" aria-label="Filter projects">${filterBtn('all', 'All', true)}${present.map(c => filterBtn(c, CATEGORIES[c], false)).join('')}
        </div>` : ''}
        <ul class="grid grid-cols-2 lg:grid-cols-4 grid-flow-row-dense gap-3 sm:gap-4" data-gallery>${gallery.map(tile).join('')}
        </ul>
        <p class="mt-6 text-slatey" data-gallery-empty hidden>No photos in this category yet. Call us and we'll share examples.</p>`;

// ---------- Reviews ----------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = d => { const m = /^(\d{4})-(\d{2})/.exec(d || ''); return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : ''; };
const STAR = '<svg width="SZ" height="SZ" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 9.2 8.6 2 9.2l5.5 4.7L5.8 21 12 17.3 18.2 21l-1.7-7.1L22 9.2l-7.2-.6z"/></svg>';
const stars = (n, size) => n ? `<div class="flex gap-0.5 text-brass-light mb-4" role="img" aria-label="${n} out of 5 stars">${STAR.replace(/SZ/g, size).repeat(n)}</div>` : '';
reviews.forEach((r, i) => {
  if (!r.quote) problems.push(`reviews[${i}]: missing "quote"`);
  if (r.rating != null && !(r.rating >= 1 && r.rating <= 5)) problems.push(`reviews[${i}]: rating must be 1-5 or null`);
  if (r.date && !/^\d{4}-\d{2}/.test(r.date)) problems.push(`reviews[${i}]: date must look like 2025-09`);
});
const meta = (r, dark) => {
  const chip = dark ? 'rounded-[3px] border border-white/25 px-2.5 py-0.5 font-medium text-white' : 'rounded-[3px] border border-ink/15 px-2.5 py-0.5 font-medium text-ink';
  const who = [r.author, fmtDate(r.date)].filter(Boolean).join(', ');
  return `<figcaption class="mt-auto pt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm ${dark ? 'text-white/75' : 'text-slatey'}">
              ${who ? `<span class="w-full font-semibold ${dark ? 'text-white' : 'text-ink'}">${esc(who)}</span>` : ''}
              <span class="${chip}">${esc(r.source)}</span><span>${esc(r.project || '')}</span>
              ${r.verbatim ? '' : `<span class="w-full text-xs ${dark ? 'text-white/60' : 'text-slatey'}">Summary of a real ${esc(r.source)} review</span>`}
            </figcaption>`;
};
const featured = reviews.find(r => r.featured) || reviews[0];
const others = reviews.filter(r => r !== featured);
const lgRem = (others.length - 2) % 3;
const card = (r, i) => {
  const last = i === others.length - 1;
  const span = [last && others.length > 2 && lgRem === 2 ? 'lg:col-span-2' : '', last && others.length > 2 && lgRem === 1 ? 'lg:col-span-3' : '', last && others.length % 2 === 1 ? 'md:col-span-2 lg:col-span-1' : ''].filter(Boolean).join(' ');
  return `
          <figure class="bg-white rounded-md p-8 flex flex-col ${span}">
            ${stars(r.rating, 16)}<blockquote class="serif text-[1.22rem] leading-relaxed text-ink"><p>${r.verbatim ? '“' + esc(r.quote) + '”' : esc(r.quote)}</p></blockquote>
            ${meta(r, false)}
          </figure>`;
};
const sources = [...new Set(reviews.filter(r => !r.verbatim).map(r => r.source))];
blocks.reviews = featured ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <figure class="lap text-white rounded-md p-7 sm:p-9 md:col-span-2 lg:col-span-2 ${others.length >= 2 ? 'lg:row-span-2' : ''} flex flex-col">
            ${stars(featured.rating, 20)}${featured.headline ? `<p class="serif text-[3.4rem] sm:text-[5rem] leading-none text-brass-light">“${esc(featured.headline)}”</p>` : ''}
            <blockquote class="serif mt-6 text-[1.45rem] sm:text-[1.8rem] leading-snug text-white/90 max-w-[34rem]"><p>${featured.verbatim ? '“' + esc(featured.quote) + '”' : esc(featured.quote)}</p></blockquote>
            ${meta(featured, true)}
          </figure>${others.map(card).join('')}
        </div>
        ${sources.length ? `<p class="mt-6 text-sm text-slatey">Reviews marked “Summary” paraphrase real customer feedback from ${sources.join(' and ')}.</p>` : ''}` : '';

// ---------- Stop on content mistakes (clear message for the owner) ----------
if (problems.length) {
  console.error('\nBuild stopped. Please fix these in content/photos.js or content/reviews.js:\n  - ' + problems.join('\n  - ') + '\n');
  process.exit(1);
}

// ---------- Write blocks into index.html ----------
const indexPath = path.join(ROOT, 'index.html');
let html = readFileSync(indexPath, 'utf8');
for (const [name, content] of Object.entries(blocks)) {
  const re = new RegExp(`(<!-- BUILD:${name} -->)[\\s\\S]*?(<!-- /BUILD:${name} -->)`);
  if (!re.test(html)) { console.error(`index.html is missing the <!-- BUILD:${name} --> marker`); process.exit(1); }
  html = html.replace(re, (_, a, b) => `${a}\n      ${content}\n      ${b}`);
}
writeFileSync(indexPath, html);

// ---------- Compile Tailwind ----------
const twBin = path.join(ROOT, 'node_modules', '.bin', 'tailwindcss');
execFileSync(twBin, ['-c', 'tailwind.config.js', '-i', 'assets/tailwind.src.css', '-o', 'assets/site.css', '--minify'], { cwd: ROOT, stdio: 'inherit' });

// ---------- Copy deployable files to dist/ ----------
const DIST = path.join(ROOT, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(path.join(DIST, 'assets'), { recursive: true });
for (const f of ['index.html', '404.html', 'favicon.svg', 'robots.txt']) cpSync(path.join(ROOT, f), path.join(DIST, f));
cpSync(path.join(ROOT, 'images'), path.join(DIST, 'images'), { recursive: true });
cpSync(path.join(ROOT, 'assets', 'site.css'), path.join(DIST, 'assets', 'site.css'));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(path.join(DIST, 'sitemap.xml'), readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`));

console.log(`Built: ${gallery.length} gallery photos, ${pairs.length} before/after pairs, ${reviews.length} reviews -> dist/`);
