/** @type {import('tailwindcss').Config} */
export default {
  content:  ["./index.html","./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#005EA2',
        'secondary-blue': '#2496EF',
        'base-lightest':'#f0f0f0',
        'red-error': '#B50909',
        'blue-info': '#00BDE3',
        'button-disabled': '#C9C9C9'
      },
      backgroundColor: {
        'black-overlay': 'rgba(0, 0, 0, 0.75)'
      }
    },
  },
  plugins: [],
}

