/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0A0A',
          950: '#070707',
          900: '#0A0A0A',
          800: '#121212',
          700: '#171717',
        },
        charcoal: {
          DEFAULT: '#171717',
          dark: '#111111',
          card: '#1F1F1F',
          border: '#282828',
          light: '#333333'
        },
        offwhite: {
          DEFAULT: '#F5F3EE',
          warm: '#F5F3EE',
          surface: '#FAF8F5',
          border: '#E8E5DD',
          darker: '#EDEAE2'
        },
        champagne: {
          DEFAULT: '#C6AD83',
          light: '#DFCCA8',
          dark: '#A68E63',
          subtle: 'rgba(198, 173, 131, 0.15)'
        },
        muted: {
          DEFAULT: '#A3A3A3',
          light: '#737373',
          dark: '#525252'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Montserrat', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
};
