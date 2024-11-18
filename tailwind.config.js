/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
        "light",
        {
          fitfeud: {
            "primary": "#A288A6",
            "secondary": "#664C6B",
            "accent": "#73956F",
            "neutral": "#141414",
            "base-100": "#ffffff",
            "info": "#4091d7",
            "success": "#4F9D69",
            "warning": "#F99C39",
            "error": "#D84654",
          },
        }
    ]
  }
}

