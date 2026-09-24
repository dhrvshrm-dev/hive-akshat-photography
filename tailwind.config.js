/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241C17",     // warm espresso — main text / dark sections
        ivory: "#F6F1E9",   // warm paper — page background
        blush: "#EFE6DA",   // soft section background
        rose: "#8E2C3A",    // deep kumkum rose — primary accent
        gold: "#B98A3E",    // muted gold — secondary accent
        taupe: "#8A7C6E",   // muted text
        line: "#E3D8C8",    // hairline borders
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};
