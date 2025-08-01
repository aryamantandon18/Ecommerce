
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'image': '0px 0px 7px 1px rgba(96,165,250,0.7)', 
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Adding Roboto font-family
      },
      keyframes:{
        fromDown:{
          '0%':{transform:'translateY(10%)',opacity:'20%'},
          '50%':{transform:'translateY(5%)',opacity:'50%'},
          '100%':{transform:'translateY(0%)',opacity:'100%'},
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation:{
        fromDown:'fromDown 0.4s ease-out',
        fadeIn: 'fadeIn 0.3s ease-in-out forwards'
      }
    },
    
  },
  plugins: [
    require('tailwind-scrollbar'),
    plugin(function({ addComponents }) {
      addComponents({
        '.nav-link': {
          '@apply relative flex items-center h-full text-white hover:text-yellow-300 transition-colors focus:text-yellow-300': {},
          '&::before': {
            content: "''",
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: '2px',
            width: '0',
            backgroundColor: '#facc15', /* Tailwind yellow-300 */
            transition: 'width 0.3s',
          },
          '&:hover::before': {
            width: '100%',
          }
        }
      })
    })
  ],
}
