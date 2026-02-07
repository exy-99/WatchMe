/** @type {import('tailwindcss').Config} */

module.exports = {

  // NOTE: Update this to include the paths to all of your component files.

  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  theme: {

    extend: {
      fontFamily: {
        serif: ["PlayfairDisplay_400Regular", "serif"],
        sans: ["Lato_400Regular", "sans-serif"],
        playfair: ["PlayfairDisplay_400Regular", "serif"],
        playfairBold: ["PlayfairDisplay_700Bold", "serif"],
        lato: ["Lato_400Regular", "sans-serif"],
        latoBold: ["Lato_700Bold", "sans-serif"],
        hennyPenny: ["HennyPenny_400Regular", "cursive"],
      },
      colors: {
        primary: "#84f906",
        secondary: "#121212",
      },
    },

  },

  plugins: [],

}