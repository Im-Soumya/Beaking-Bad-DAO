/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        230: "230px",
        247: "247px",
        253: "253px",
        290: "290px",
        300: "300px",
        345: "345px",
        460: "460px",
        470: "470px",
        500: "500px",
      },
      colors: {
        "ocean-green": "#44B785",
      },
    },
  },
  plugins: [],
};
