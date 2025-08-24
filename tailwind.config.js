
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { sabco: { DEFAULT: '#0B5F8A', accent: '#F5A524' } }
    }
  },
  plugins: [],
}
