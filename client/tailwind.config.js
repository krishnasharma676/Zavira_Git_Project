/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zavira: {
          purple: '#7A578D',
          purpleLight: '#C9A0C8',
          black: '#121212',
          blackDeep: '#0D0D0D',
          cream: '#FDFBF9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'xxs': '10px',
        'xs': '11px',
        'sm': '13px',
        'base': '15px',
        'lg': '17px',
        'xl': '22px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      fontWeight: {
        'thin': '200',
        'normal': '400',
        'medium': '500',
        'bold': '700',
        'black': '900',
      },
      letterSpacing: {
        'widest': '.25em',
        'tighter': '-.03em',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
