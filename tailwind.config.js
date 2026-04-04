/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#e6f6f3',
          100: '#cceee7',
          200: '#99ddcf',
          300: '#66ccb7',
          400: '#4dbfa8',
          500: '#39ae99',
          600: '#329a88',
          700: '#2b8576',
          800: '#246f64',
          900: '#1c5952'
        }
      }
    },
  },
  plugins: [],
}