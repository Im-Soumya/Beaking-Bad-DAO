/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        200: "200px",
        233: "233px",
        220: "220px",
        270: "253px",
        290: "290px",
        300: "300px",
        345: "345px",
        385: "385px",
        410: "410px",
        425: "425px",
        460: "460px",
        570: "570px",
      },
      colors: {
        "dark-green": "#093009",
        "forest-green": "#0D3E10",
        "mughal-green": "#1F6032",
        "ocean-green": "#57cc99",
        "japanese-laurel": "#29773E",
        "sea-green": "#369457",
        "smoky-black": "#032202",
      },
    },
  },
  plugins: [],
};
