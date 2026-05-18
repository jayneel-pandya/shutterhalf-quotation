/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f7f4',
          100: '#efece3',
          200: '#ddd6c3',
          300: '#c8bb9d',
          400: '#b09f7a',
          500: '#a08b63',
          600: '#937a56',
          700: '#7b6449',
          800: '#655140',
          900: '#544437',
          950: '#2d241c',
        },
        ink: {
          50: '#f6f6f7',
          100: '#e2e2e6',
          200: '#c5c5cc',
          300: '#a0a0ac',
          400: '#7d7d8b',
          500: '#636371',
          600: '#4f4f5b',
          700: '#42424b',
          800: '#393940',
          900: '#16161a',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
