/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          'white-md': 'rgba(255, 255, 255, 0.2)',
          'white-lg': 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(0, 0, 0, 0.1)',
          'dark-md': 'rgba(0, 0, 0, 0.2)',
          'dark-lg': 'rgba(0, 0, 0, 0.3)',
        },
      },
      // Removed unused extensions - see _graveyard/README.md for details
    },
  },
  plugins: [],
};
