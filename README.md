# SHS & Improvements: website

One-page marketing site for **SHS & Improvements** (Smart Home Services & Improvements LLC), Woodstock, GA.

It's a static site (HTML + Tailwind CSS via CDN + vanilla JS) with no build step, so it deploys to Vercel as-is.

## Deploy

- **Vercel dashboard:** import this repo, choose Framework Preset **Other**, leave the build command empty, then deploy.
- **CLI:** run `npx vercel --prod` from this folder.

To preview locally, run `python3 -m http.server 8080` and open http://localhost:8080.

## Before launch checklist

1. **Quote form email.** Create a free form at [formspree.io](https://formspree.io) and paste its endpoint into `FORM_ENDPOINT` near the bottom of `index.html`.
   Until you do, submitting the form opens a pre-filled text message to (404) 996-7297, so requests still reach Erick.
2. **Replace placeholder photos.** Every stock image is tagged "Placeholder" on the page. Drop real project photos into `/images` using the same file names (or edit the `src`/`alt` in `index.html`), then delete the `<span class="ph">` tags.

   | File | Where it's used |
   | --- | --- |
   | `hero-farmhouse-siding.jpg` (1920w) + `hero-farmhouse-siding-900.jpg` (portrait, mobile) | Hero, Paint gallery tile |
   | `siding-craftsman-sage.jpg` | Siding before/after, Siding gallery tile |
   | `deck-outdoor-living.jpg` | Deck before/after, Decks gallery tile |
   | `porch-craftsman.jpg`, `porch-bungalow.jpg` | "Why SHS" photo, porch tiles, About photo |
   | `roofing-crew.jpg`, `roofing-traditional-home.jpg` | Roofing tiles |
   | `paint-modern-exterior.jpg` | Paint tile |
   | `og-image.jpg` (1200×630) | Social share preview |

   **Before/after sliders:** the "before" side currently reuses the after photo with a faded filter. For a real pair, change the `.before` image's `src` to the real before photo and remove its `filter` in the `<style>` block (`.ba .before`).
3. **Reviews.** The five review cards summarize real themes from Nextdoor and Angi. Replace them with customers' verbatim quotes (and a first name or neighborhood, with permission).
4. **About photo.** Swap in a photo of Erick and his wife or the team.

## SEO included

- Title, meta description, canonical URL, Open Graph and Twitter tags
- `HomeAndConstructionBusiness` (LocalBusiness) JSON-LD with address, phone, hours, service area and a service catalog
- `sitemap.xml` and `robots.txt` (they assume the domain is `https://shsimprove.com`; update them if it differs)
- Semantic landmarks, descriptive alt text, accessible form labels and errors

Placeholder photos are from Unsplash (Unsplash License).
