/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark first: photographs read best against near-black, the way they do
        // on a camera's rear screen.
        night: "#0A0908",   // page background
        soot: "#13110F",    // raised surfaces, cards
        smoke: "#1C1916",   // hover / inputs
        bone: "#EDE6DA",    // primary text
        ash: "#8C857A",     // muted text
        line: "#2A2622",    // hairlines on dark
        // The one signal colour — a viewfinder's focus-confirm, and saffron.
        saffron: "#F0782D",
        // Diya light. Warm highlights, never a UI colour on its own.
        ember: "#E0A94A",
        // The field-journal pages: the one place the site turns the lights on.
        paper: "#E8E0D0",
        ink: "#16130F",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
        hud: "0.18em",
      },
      maxWidth: {
        content: "80rem",
      },
      fontSize: {
        // Fluid display sizes, so a headline scales with the viewport instead of
        // jumping at breakpoints.
        "fluid-xl": ["clamp(3rem, 8vw, 8.5rem)", { lineHeight: "0.92" }],
        "fluid-lg": ["clamp(2.4rem, 5.6vw, 5.5rem)", { lineHeight: "0.98" }],
        "fluid-md": ["clamp(1.8rem, 3.6vw, 3.4rem)", { lineHeight: "1.08" }],
      },
    },
  },
  plugins: [],
};
