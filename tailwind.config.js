/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fancy: ['"Dancing Script"', 'cursive'], // Add the font under a custom key like 'fancy'
      },
      colors:{
        indigo:"#014e7a",
        tiffanie:"#A9DDD6"
      },
      screens: {
        xxs: "360px", 
        xs:"400px",
        xsmall:"450px",
        small:"520px",
        medium:"580px"
      },
    },
  },
  plugins: [],
}
