/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        100: "570px",
      },
      padding: {
        101: "345px",
      },
      colors: {
        "dark-green": "#093009",
        "forest-green": "#0D3E10",
        "mughal-green": "#1F6032",
        "japanese-laurel": "#29773E",
        "sea-green": "#369457",
        "smoky-black": "#032202",
      },
    },
  },
  plugins: [],
};
