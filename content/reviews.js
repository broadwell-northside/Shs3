/*
 * ===================================================================
 *  REVIEWS: edit this file to change the reviews on the website.
 * ===================================================================
 *
 *  RULES (please keep these, for honesty and for Google's review policies):
 *  - Only use real reviews. Never make up a review or a name.
 *  - verbatim: true   ONLY when  quote  is copied word-for-word from the review.
 *    verbatim: false  means it's a short summary of a real review. The site
 *                     then labels it "Summary of a real review".
 *  - author: first name + last initial ('Sarah M.'), and only with the
 *            customer's permission. Leave it null otherwise.
 *  - date:   'YYYY-MM' (e.g. '2025-09'), when the review was posted.
 *  - rating: 1-5, only if the platform shows stars (Google, Angi).
 *            Nextdoor recommendations have no stars, so leave it null.
 *  - source: 'Nextdoor' | 'Angi' | 'Google' | 'Facebook'
 *  - project: a few words describing the job.
 *  - featured: true on ONE review to show it as the big card.
 *    headline (optional, featured card only): a short phrase taken from the review.
 *
 *  Save, commit and push. Vercel rebuilds the site automatically.
 */

module.exports = [
  {
    featured: true,
    headline: 'Outstanding.',
    quote: 'Our covered patio was a concrete slab under a metal roof. SHS turned it into a solid, beautiful room that matches the house like it was always there.',
    source: 'Nextdoor',
    project: 'Covered patio enclosure',
    author: null, date: null, rating: null, verbatim: false,
  },
  {
    quote: 'Honest and trustworthy from start to finish. When they found hidden rot during our deck demolition, they handled it the right way, stayed in budget, worked quickly and kept us updated while we were away.',
    source: 'Nextdoor',
    project: 'Deck demolition & rebuild',
    author: null, date: null, rating: null, verbatim: false,
  },
  {
    quote: 'New concrete posts, a full new deck structure, a roof and a fireplace. Finished on time and on budget, even with our change orders. A kind, honest crew.',
    source: 'Nextdoor',
    project: 'Deck, roof & fireplace',
    author: null, date: null, rating: null, verbatim: false,
  },
  {
    quote: 'Professional, friendly and meticulous. They cleaned up every night and again at the end, and their communication and follow-up were exceptional.',
    source: 'Nextdoor',
    project: 'Outdoor living project',
    author: null, date: null, rating: null, verbatim: false,
  },
  {
    quote: 'He came out promptly to look at the job. His quote was competitive but not the cheapest, and we chose SHS for the trust and professionalism. Our laundry room counters and cabinets came out great.',
    source: 'Angi',
    project: 'Laundry room counters & cabinets',
    author: null, date: null, rating: null, verbatim: false,
  },
];
