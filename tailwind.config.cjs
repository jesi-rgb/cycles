/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Cabin"], mono: ["Recursive Monospace"] },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: ["autumn", "night", "cymk"],
  },
};
