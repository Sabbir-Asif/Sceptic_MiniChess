/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-secondary': "#312e2b",
        'black-primary': "#2c2b29",
        'green-secondary' : "#81b64c",
        'green-primary' : "#769656"
      },
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    daisyui
  ],
}