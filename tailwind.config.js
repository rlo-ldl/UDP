/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f5f1ee',
          100: '#ece3dc',
          200: '#d9cfc5',
          300: '#c3b4a3',
          500: '#9db7ad',
          700: '#6f817a',
          900: '#2d2b2a',
        },
        gold: {
          100: '#f7f0ea',
          200: '#eadcc6',
          300: '#d2b296',
          500: '#7a5f3c',
        },
        blush: '#f4efe7',
        cream: '#f8f4f0',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(54, 64, 52, 0.12)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(255,255,255,0.35), transparent 32%)',
      },
    },
  },
  plugins: [],
};
