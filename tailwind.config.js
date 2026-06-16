/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF9EB',
          100: '#FEF0C7',
          200: '#FDE193',
          300: '#FCD260',
          400: '#FBC32D',
          500: '#F5A623', // OR SURYA
          600: '#E0950A',
          700: '#C27D08',
          800: '#A36506',
          900: '#844D04',
        },
        secondary: {
          500: '#2DD4BF', // Teal
        },
        accent: {
          500: '#FF6B6B', // Coral
        },
      },
    },
  },
  plugins: [],
}