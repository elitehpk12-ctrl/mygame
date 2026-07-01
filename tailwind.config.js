/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1020',
        panel: 'rgba(10, 14, 28, 0.82)',
        gold: '#f4c542',
        hpred: '#e6473f',
        manablue: '#3fa7e6',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['Cinzel', 'serif'],
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(120,150,220,0.25), 0 8px 24px rgba(0,0,0,0.5)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        floaty: 'floaty 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
