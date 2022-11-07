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
      backgroundImage: {
        'reporting_image': "url('./assets/bg.png')",
      },
      colors:{
        header : '#282c34',
        smartestred : '#C11823',
        smartestgray : '#565458'
      },
      height:{
        120 : '30rem',
      },
      minHeight:{
        120 : '30rem'
      }
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
}
