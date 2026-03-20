/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Clases de colores de marca (valores hex) por si se usan dinámicamente
  safelist: [
    'bg-[#44482c]', 'bg-[#e8d79a]', 'bg-[#849b50]', 'bg-[#b1c181]',
    'hover:bg-[#44482c]', 'hover:bg-[#e8d79a]', 'hover:bg-[#849b50]', 'hover:bg-[#b1c181]',
    'focus:bg-[#44482c]', 'focus:bg-[#e8d79a]', 'focus:bg-[#849b50]', 'focus:bg-[#b1c181]',
    'text-[#44482c]', 'text-[#e8d79a]', 'text-[#849b50]', 'text-[#b1c181]',
    'hover:text-[#44482c]', 'hover:text-[#e8d79a]', 'hover:text-[#849b50]', 'hover:text-[#b1c181]',
    'focus:text-[#44482c]', 'focus:text-[#e8d79a]', 'focus:text-[#849b50]', 'focus:text-[#b1c181]',
    'border-[#44482c]', 'border-[#e8d79a]', 'border-[#849b50]', 'border-[#b1c181]',
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
          // Aliases para acceso directo sin guiones (para compatibilidad)
          bosquesNublados: '#44482c',
          amarilloTierra: '#e8d79a',
        },
      },
      fontFamily: {
        // Primary Font: JOST
        // Características: Clear, Modern, Friendly, Simple style, Highly legible
        // Uso: Comunicaciones internas y externas
        'primary': ['Jost', 'system-ui', 'sans-serif'],
        // Secondary Font 1 según manual de marca: Champagne & Limousines Bold
        // Tracking: 500pt (0.5em)
        // Uso: Slogan y mensajes promocionales
        'slogan': ['"Champagne & Limousines"', 'cursive', 'serif'],
        // Secondary Font 2 según manual de marca: Futura Bold
        // Uso: Títulos alternativos o acentos
        // Nota: Usando Montserrat como alternativa similar hasta obtener Futura
        'accent': ['Futura', 'Montserrat', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        'slogan': '0.5em', // Tracking 500pt para slogan
      },
    },
  },
  plugins: [],
}

