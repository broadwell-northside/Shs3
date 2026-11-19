# SHS & Improvements: website

One-page site for **SHS & Improvements** (Smart Home Services & Improvements LLC), Woodstock, GA.
Live: https://shs-improvements.vercel.app

How it's built: static HTML, Tailwind CSS compiled at build time, and one Vercel serverless function that emails quote requests. Every push to GitHub redeploys automatically.

---

## 1. Turn on the quote form emails (required)

The form posts to `/api/quote` (`api/quote.js`), which emails each request through [Resend](https://resend.com).

In **Vercel → shs-improvements → Settings → Environment Variables**, add these for the Production environment, then redeploy:

| Variable | Required | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Your Resend API key (starts with `re_`). |
| `QUOTE_TO_EMAIL` | yes | The inbox that should receive leads (Erick's email). Comma-separate several addresses. |
| `QUOTE_FROM_EMAIL` | optional | Sender, e.g. `SHS Website <quotes@shsimprove.com>`. Only works after you verify `shsimprove.com` in Resend (Domains → Add, then add the DNS records it shows). |

Notes:
- **Until a domain is verified,** leave `QUOTE_FROM_EMAIL` unset. The default sender `onboarding@resend.dev` only delivers to the email address that owns the Resend account, so for testing, set `QUOTE_TO_EMAIL` to that address.
- **Replying to a lead** replies straight to the customer: the email's reply-to is their address.
- **If the variables are missing or Resend fails,** visitors see an error with call and text options, and their details stay filled in. Nothing is silently lost.
- **On phones,** the confirmation also offers "Text Erick photos of the project" as an optional extra.

## 2. Swap in real photos

Everything is controlled by **`content/photos.js`**. It's commented and you don't need to touch the HTML.

1. Drop the photo into **`/images`** (JPG, about 1600 px wide). Use clear names like `siding-maple-st-2025.jpg`.
2. In `content/photos.js`, point an entry at it, write a plain description in `alt`, and set `placeholder: false`.
3. Commit and push. The site rebuilds in about 30 seconds.

The slots are:

| Slot | Where it appears | Best photo |
| --- | --- | --- |
| `hero` | Top of the page | Finished exterior, landscape orientation. Add a tall 900×1200 crop as `srcMobile` for phones. |
| `why` | "What makes us different" | Crew at work or a finished porch |
| `about` | "A family business" | Erick and his wife, or the team |
| `gallery` | "Our work" (any number of photos) | Each one needs a `category`: `siding`, `decks`, `porch`, `roofing` or `paint`. Optional `size`: `large` (once, your best shot) or `wide`. |

**Before/after sliders** are hidden until you add a pair. Take both photos from the same spot, then name them so they sort together:

```
/images/ba-smith-deck-before.jpg
/images/ba-smith-deck-after.jpg
```

Then add them to `beforeAfter` in `content/photos.js`. The exact format is at the top of that file. One or two pairs look best.

If a file name is mistyped, the build stops with a plain-English message naming the problem, and the live site stays as it was.

## 3. Reviews

Reviews live in **`content/reviews.js`**. Each one has `quote`, `source`, `project`, and optionally `author` (first name and last initial, with permission), `date` (`YYYY-MM`) and `rating` (only if the platform shows stars).

- `verbatim: false` (the current five): a summary of a real Nextdoor or Angi review. The site labels these "Summary of a real … review".
- `verbatim: true`: a word-for-word quote. It's shown in quotation marks.

Never add a made-up review or name.

## 4. Developing locally

```
npm install
npm run build        # renders content into index.html, compiles CSS, writes dist/
npx serve dist       # or: python3 -m http.server -d dist
```

- `index.html` is the page. Parts between `<!-- BUILD:… -->` markers are generated from `content/`, so edit those files instead.
- Styles: `assets/tailwind.src.css` plus Tailwind classes in the HTML. The `npm run build` step outputs `assets/site.css`.
- `vercel.json` sets the build command and output folder (`dist`) and the caching headers.

## SEO checklist (done)

- Title, meta description, canonical URL, Open Graph and Twitter tags
- `HomeAndConstructionBusiness` (LocalBusiness) JSON-LD with address, phone, hours, service area and services
- `sitemap.xml` and `robots.txt`. They point at `https://shsimprove.com`, so connect that domain in Vercel when you're ready.

Placeholder photos are from Unsplash (Unsplash License).
