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
        ink: { DEFAULT: '#18232D', 2: '#22313D', 3: '#2E3F4D' },
        amber: { DEFAULT: '#D2953A', deep: '#8F6118', soft: '#F3E3C7' },
        sage: { DEFAULT: '#7E8C72', deep: '#56634C', soft: '#E3E8DD' },
        primer: '#EEF0EB',
        slatey: '#56616B',
      },
      fontFamily: { sans: ['Archivo', 'system-ui', 'sans-serif'] },
      maxWidth: { site: '76rem' },
    },
  },
};
