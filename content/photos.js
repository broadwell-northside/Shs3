/*
 * ===================================================================
 *  SITE PHOTOS: edit this file to change every photo on the website.
 * ===================================================================
 *
 *  1. Put your photo in the  /images  folder (JPG, about 1600 px wide is ideal).
 *  2. Point an entry below at it:  src: '/images/your-file.jpg'
 *  3. Write a short, plain description in  alt  (what a blind visitor should
 *     "see"). Mention the town if you like: it helps Google.
 *  4. Set  placeholder: false  so the "Placeholder" tag disappears.
 *  5. Save, commit and push. Vercel rebuilds the site automatically.
 *
 *  Gallery categories (must be one of these):
 *    'siding' | 'decks' | 'porch' | 'roofing' | 'paint'
 *
 *  Gallery tile sizes (optional):
 *    size: 'large'  -> big 2x2 tile      (use for your best photo, once)
 *    size: 'wide'   -> 2 columns wide    (good for landscape shots)
 *    (leave it out)  -> normal square tile
 *
 *  BEFORE / AFTER sliders:
 *    The "beforeAfter" list starts empty, so no sliders are shown.
 *    Add a pair when you have a BEFORE and an AFTER photo of the SAME spot,
 *    ideally taken from the same position. Name the files so they sort
 *    together, for example:
 *        /images/ba-smith-deck-before.jpg
 *        /images/ba-smith-deck-after.jpg
 *    Then add:
 *        {
 *          before: '/images/ba-smith-deck-before.jpg',
 *          after:  '/images/ba-smith-deck-after.jpg',
 *          alt: 'Rotted deck replaced with a new deck and railing',
 *          title: 'Deck rebuild',
 *          detail: 'new structure & railing',
 *        },
 *    Up to two pairs look best.
 */

module.exports = {
  // Large photo at the top of the page. srcMobile is a tall crop for phones (900 x 1200).
  hero: {
    src: '/images/hero-farmhouse-siding.jpg',
    srcMobile: '/images/hero-farmhouse-siding-900.jpg',
    alt: 'White two-story farmhouse with horizontal lap siding and a wraparound front porch',
    placeholder: true,
  },

  // Photo beside "What makes us different". A crew-at-work or finished-porch shot works well.
  why: {
    src: '/images/porch-craftsman.jpg',
    alt: 'Craftsman-style home with a covered front porch and tapered columns',
    placeholder: true,
  },

  // Photo in "A family business". Ideally Erick and his wife, or the team on a job site.
  about: {
    src: '/images/porch-bungalow.jpg',
    alt: 'Placeholder for a photo of Erick Von Borries and his wife',
    placeholderLabel: 'Placeholder: photo of Erick & family',
    placeholder: true,
  },

  // "Our work" gallery. Order here = order on the page.
  gallery: [
    { src: '/images/siding-craftsman-sage.jpg', category: 'siding', size: 'large', placeholder: true,
      alt: 'Craftsman home with sage fiber-cement siding, stone base and white trim' },
    { src: '/images/deck-outdoor-living.jpg', category: 'decks', placeholder: true,
      alt: 'Wood home with a wide elevated deck overlooking the yard' },
    { src: '/images/porch-bungalow.jpg', category: 'porch', placeholder: true,
      alt: 'Bungalow with a covered front porch and white railings' },
    { src: '/images/roofing-crew.jpg', category: 'roofing', placeholder: true,
      alt: 'Roofer working on a shingle roof replacement' },
    { src: '/images/hero-farmhouse-siding.jpg', category: 'paint', placeholder: true,
      alt: 'Freshly painted white farmhouse with lap siding and wraparound porch' },
    { src: '/images/porch-craftsman.jpg', category: 'porch', placeholder: true,
      alt: 'Craftsman front porch with tapered columns' },
    { src: '/images/roofing-traditional-home.jpg', category: 'roofing', size: 'wide', placeholder: true,
      alt: 'Two-story brick home with a new architectural shingle roof' },
    { src: '/images/paint-modern-exterior.jpg', category: 'paint', placeholder: true,
      alt: 'Modern home exterior with crisp white paint and wood accent panels' },
  ],

  // Before / after slider pairs (see instructions at the top). Empty = sliders hidden.
  beforeAfter: [],
};
