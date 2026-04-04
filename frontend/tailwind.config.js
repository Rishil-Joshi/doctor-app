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
        'pastel-lavender': '#e0d7f8',
        'pastel-pink': '#fce4ec',
        'pastel-mint': '#b2dfdb',
        'pastel-blue-dark': '#5b9bb5',
        'pastel-green': '#c8e6c9',
        'pastel-coral': '#e57373',
        'pastel-cream': '#fdf8f0',
      },
    },
  },
  plugins: [],
};