/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        drive: {
          '0%': { transform: 'translateX(-80px)' },
          '100%': { transform: 'translateX(calc(100% + 80px))' }
        },
        grow: {
          '0%, 100%': { height: '12px' },
          '50%': { height: '6px' }
        }
      },
      animation: {
        'drive': 'drive 15s linear infinite',
        'grow': 'grow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}