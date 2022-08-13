/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',],
  theme: {
    
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      colors:{
        header : '#282c34',
      },
      height:{
        100 : '30rem',
      }
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
}
