/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Forzar generación de clases de colores secondary con guiones usando valores arbitrarios
    {
      pattern: /bg-\[#(44482c|e8d79a|849b50|b1c181)\]/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /text-\[#(44482c|e8d79a|849b50|b1c181)\]/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /border-\[#(44482c|e8d79a|849b50|b1c181)\]/,
    },
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

