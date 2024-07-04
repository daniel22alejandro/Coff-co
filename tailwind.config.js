/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sena: "rgb(57, 169, 0)",
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        calibri:['Calibri', 'Arial', 'sans-serif']
      },
    },
  },

  theme: {
    extend: {
      boxShadow: {
        "dark-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)",

        "shadow-sena":
          "0 10px 15px -3px rgb(57, 169, 0), 0 4px 6px -2px rgb(57, 169, 0)",
      },
    },
  },

  darkMode: "class",
  plugins: [nextui(), require("daisyui")],
};
