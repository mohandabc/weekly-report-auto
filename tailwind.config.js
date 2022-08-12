/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',],
  theme: {
    colors:{
      header : '#282c34',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      height:{
        100 : '30rem',
      }
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
}
