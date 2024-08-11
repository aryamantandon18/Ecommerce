/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'image': '0px 0px 7px 1px rgba(96,165,250,0.7)', 
      },
    },
  },
  plugins: [],
}
