/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Plein"], mono: ["Recursive"] },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: ["dracula"],
    darkTheme: "dracula",
  },
};
