/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xxs: "320px",
        // => @media (min-width: 320px) { ... }
        xs: "440px",
        // => @media (min-width: 440px) { ... }
        sms: "600px",

        sm: "640px",
        // => @media (min-width: 640px) { ... }
        mds: "700px",

        md: "850px",
        // => @media (min-width: 850px) { ... }

        lg: "1026px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        xxxl: "1350",

        xxl: "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      fontFamily: {
        "Exo 2": ["Exo 2", "sans-serif"],
        montserrat: ["Montserrat"],
        Lollipop: ["Lollipop"],
      },
      colors: {
        cadetblue: "#5f9ea0",
        darkcadetblue: "#335557",
        skyblue: "#38bdf8",
        sky900: "#0c4a6e",
        sky950: "#082f49",
        cyan400: "#22d3ee",
        cyan500: "#06b6d4",
        cyan600: "#0891b2",
        cyan700: "#0e7490",
        cyan800: "#155e75",
        cyan900: "#164e63",
        gray600: "#4b5563",
        gray50: "#f9fafb",
        gray400: "#9ca3af",
        yellow300: "#fde047",
        yellow400: "#facc15",
        yellow500: "#eab308",
        yellow600: "#ca8a04",
        purple400: "#c084fc",
        pink600: "#db2777",
        lightBlack: "#2c2c2c",
        midBlack: "#515050",
        lighterBlack: "#464444",
        dimBlack: "#2e302d",
        darkgrey: "#313131",
        blue400: "#60a5fa",
        green400: "#4ade80",
        midgreen: "#059669",
        teal400: "#2dd4bf",
        teal500: "#14b8a6",
        teal600: "#0d9488",
        red400: "#f87171",
        rose200: "#fecdd3",
        red600: "#dc2626",

        // dark
        grey800: "#1f2937",
        slate600: "#475569",
        slate100: "#f1f5f9",
      },
    },
  },
  plugins: [],
});
