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
          DEFAULT: '#6e6c35', // Verde Selva
          light: '#8a8852',
          dark: '#52501f',
        },
        secondary: {
          'bosques-nublados': '#44482c', // Verde Bosques Nublados
          'pradera': '#849b50', // Verde Pradera
          'claro': '#b1c181', // Verde Claro
          'amarillo-tierra': '#e8d79a', // Amarillo Tierra
        },
      },
      fontFamily: {
        'primary': ['Inter', 'system-ui', 'sans-serif'], // Typographica fallback - Clear, Modern, Friendly
        'slogan': ['"Champagne & Limousines"', 'cursive', 'serif'], // Para slogan y mensajes promocionales
        'accent': ['"Futura"', 'Arial', 'sans-serif'], // Para títulos alternativos
      },
      letterSpacing: {
        'slogan': '0.5em', // Tracking 500pt para slogan
      },
    },
  },
  plugins: [],
}

