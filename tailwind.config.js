/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Merah Yakapetra — terinspirasi dari logo merah
        primary: {
          50:  '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc0c0',
          300: '#ff9393',
          400: '#ff5757',
          500: '#f83030',
          600: '#e01010',  // warna utama merah
          700: '#ba0a0a',
          800: '#990a0a',
          900: '#7c0d0d',
        },
        // Aksen abu-abu netral (dari gambar logo abu-abu)
        secondary: {
          50:  '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#5a5a5a',
          900: '#3d3d3d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
