/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width:{
        '800': '800px',
      },
      height:{
        '520':'520px',
        '300':'300px',
        '600':'600px'
      }
    },
  },
  plugins: [require("daisyui")],
}

