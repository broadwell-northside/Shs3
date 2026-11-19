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
    src: '/images/hero-estate-dusk.jpg',
    srcMobile: '/images/hero-estate-dusk-900.jpg',
    alt: 'Stately two-story home with stone and siding, lit up at dusk above a wide lawn',
    placeholder: true,
  },

  // Photo beside "What makes us different". A crew-at-work or finished outdoor-living shot works well.
  why: {
    src: '/images/outdoor-room.jpg',
    alt: 'Covered outdoor living room with a wood ceiling, fireplace and lounge seating',
    placeholder: true,
  },

  // Photo in "A family business". Ideally Erick and his wife, or the team on a job site.
  about: {
    src: '/images/craftsman-dusk.jpg',
    alt: 'Placeholder for a photo of Erick Von Borries and his wife',
    placeholderLabel: 'Placeholder: photo of Erick & family',
    placeholder: true,
  },

  // "Our work" gallery. Order here = order on the page.
  gallery: [
    { src: '/images/modern-cladding-dusk.jpg', category: 'siding', size: 'large', placeholder: true,
      alt: 'Modern home with dark and wood-tone cladding and large lit windows at dusk' },
    { src: '/images/outdoor-room.jpg', category: 'decks', caption: 'Outdoor living', placeholder: true,
      alt: 'Covered outdoor room with a wood ceiling, fireplace and lounge seating' },
    { src: '/images/sunroom-enclosure.jpg', category: 'porch', placeholder: true,
      alt: 'Enclosed sunroom with floor-to-ceiling windows and warm wood furniture' },
    { src: '/images/estate-roofline.jpg', category: 'roofing', placeholder: true,
      alt: 'Brick and stone estate home with steep architectural shingle rooflines' },
    { src: '/images/painted-modern-dusk.jpg', category: 'paint', placeholder: true,
      alt: 'Black-painted modern home with warm lit windows at dusk' },
    { src: '/images/craftsman-porch.jpg', category: 'porch', placeholder: true,
      alt: 'Gray craftsman home with a white-railed covered front porch' },
    { src: '/images/craftsman-dusk.jpg', category: 'roofing', size: 'wide', placeholder: true,
      alt: 'Wood-sided craftsman home with steep gables and glowing windows at dusk' },
    { src: '/images/wood-dark-facade.jpg', category: 'siding', placeholder: true,
      alt: 'Contemporary facade with vertical wood siding and dark panels' },
  ],

  // Before / after slider pairs (see instructions at the top). Empty = sliders hidden.
  beforeAfter: [],
};
