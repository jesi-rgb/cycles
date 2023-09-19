/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: { fontFamily: { sans: ["Anek Latin", "Bricolage Grotesque"] } },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: ["cupcake"],
  },
};
