/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  darkMode:'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',],
  theme: {
    
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      backgroundImage: {
        'light-mode': "url('./assets/lightbg.jpeg')",
        'dark-mode': "url('./assets/darkbg.jpeg')",
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
      },
      animation:{
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes:{
        'shake':
        {'10%, 90%': {
          transform: 'translate3d(-1px, 0, 0)',
        },
        
        '20%, 80%': {
          transform: 'translate3d(2px, 0, 0)',
        },
      
        '30%, 50%, 70%': {
          transform: 'translate3d(-10px, 0, 0)',
        },
      
        '40%, 60%' : {
          transform: 'translate3d(10px, 0, 0)',
        }}
      },
    },
  },
  plugins: [
    // require('flowbite/plugin')
  ],
}
