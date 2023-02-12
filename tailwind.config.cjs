/** @type {import('tailwindcss').Config} */

/*eslint-disable @typescript-eslint/no-var-requires*/
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        roboto: ["Roboto", ...defaultTheme.fontFamily.sans],
        bebas: ["Bebas Neue", ...defaultTheme.fontFamily.sans],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "primary-hover": "#0d6cb5",
        primary: "#0062ad",
        km3: "#0D632B",
        km5: "#EB1C24",
        km10: "#2D3091",
        "km3-hover": "#0e7933",
      },

      keyframes: {
        run: {
          "0%": {
            transform: "translateY(-5%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0%)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
          "100%": {
            transform: "translateY(-5%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },

      animation: {
        run: "run 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
