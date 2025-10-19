/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#fbf1f2',
          200: '#f5d9d7',
          300: '#eebfb9',
          400: '#e79e94',
          500: '#d87c6f',
          600: '#ab605b',
          700: '#8a4e4a',
          800: '#693c39',
          900: '#472a28',
        },
        cream: {
          50: '#fbf9f7',
          100: '#f6f2ef',
          200: '#e8dfd8',
        }
      },
    },
  },
  plugins: [],
}