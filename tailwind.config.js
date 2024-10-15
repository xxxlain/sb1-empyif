/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inconsolata': ['Inconsolata', 'monospace'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
};