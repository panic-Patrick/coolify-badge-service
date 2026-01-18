/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          900: "#0b1220",
          800: "#111827",
          700: "#1f2937",
        },
      },
      boxShadow: {
        card: "0 15px 45px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
