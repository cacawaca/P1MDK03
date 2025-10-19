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
          600: '#ab605b', // основной цвет
          700: '#8a4e4a', // для hover
          800: '#693c39',
          900: '#472a28',
        },
        cream: {
          50: '#fbf9f7',
          100: '#f6f2ef',
          200: '#e8dfd8',
        }
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(135deg, #a78bfa, #f472b6)',
        'gradient-blue-cyan': 'linear-gradient(135deg, #60a5fa, #22d3ee)',
        'gradient-green-emerald': 'linear-gradient(135deg, #34d399, #10b981)',
        'gradient-orange-red': 'linear-gradient(135deg, #fb923c, #ef4444)',
      }
    },
  },
  plugins: [],
}