/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pastel-bg': '#eff6f5',
        'pastel-mint-dark': '#4a9d9c',
        'pastel-blue': '#93c5d4',
        'pastel-yellow': '#fef9c3',
        'pastel-peach': '#fcd9b6',
      },
    },
  },
  plugins: [],
};