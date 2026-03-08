/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#8B5CF6',
        'dark-purple': '#6D28D9',
        'light-purple': '#A78BFA',
        'secondary-teal': '#14B8A6',
        'cyan-accent': '#06B6D4',
        'accent-orange': '#F97316',
        'gold-accent': '#F97316',
        'bg-dark': '#0F0F0F',
        'surface-dark': '#1A1A1A',
        'graphite': '#2D2D2D',
        'cream-text': '#F5F5F5',
        'muted-text': '#A0A0A0',
      },
      fontFamily: {
        'bitcount': ['Bitcount Mono Pixel', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}