/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./CLIENT/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#00F5D4",
          blue: "#00D1FF",
          green: "#10B981",
          purple: "#A855F7",
          orange: "#F59E0B",
          pink: "#EC4899",
          softBlue: "#3B82F6",
        },
        surface: {
          main: "#0B0E14",
          card: "#161B22",
          section: "#0D1117",
        },
      },
    },
  },
  plugins: [],
}