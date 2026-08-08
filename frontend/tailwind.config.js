/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B16',
        primary: '#4F7CFF',
        secondary: '#7C4DFF',
        accent: '#22D3EE',
        card: 'rgba(255, 255, 255, 0.03)',
        cardBorder: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}