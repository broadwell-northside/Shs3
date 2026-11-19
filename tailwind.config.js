/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './404.html', './scripts/build.mjs'],
  future: {
    // Hover styles only on devices that can hover (no "stuck" hover after a tap on iPhone)
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Deep blue-charcoal: text, dark sections, primary buttons
        ink: { DEFAULT: '#151D25', 2: '#1E2933', 3: '#2B3843' },
        // Antique brass: hairlines, numerals, icons. deep = text on light, light = text on dark
        brass: { DEFAULT: '#B08D5E', deep: '#7A5E3A', light: '#C9A97C', soft: '#EFE7DA' },
        // Quiet secondary (status, small accents)
        sage: { DEFAULT: '#7E8C72', deep: '#56634C', soft: '#E3E8DD' },
        // Limestone-gray alternate section background
        primer: '#EFEFEB',
        slatey: '#5A636B',
      },
      fontFamily: { sans: ['Archivo', 'system-ui', 'sans-serif'] },
      maxWidth: { site: '76rem' },
    },
  },
};
