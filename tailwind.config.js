/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6e6c35',
          light: '#8a8852',
          dark: '#52501f',
        },
      },
    },
  },
  plugins: [],
}

