/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1e1e1e",
        charcoal: "#464646",
        cream: "#f9f4eb",
        mist: "#f0f0f2",
        yellow: "#ffdd00",
        aqua: "#67e5e1",
        teal: "#005c66",
      },
      fontFamily: {
        display: ['"Figtree"', "Arial", "sans-serif"],
        ui: ['"IBM Plex Sans"', "Arial", "sans-serif"],
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};
