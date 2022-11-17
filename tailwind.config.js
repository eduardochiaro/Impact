/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./**/*.hbs"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      amber: colors.amber,
      slate: colors.slate,
      primary: colors.stone
    },
    fontFamily: {
      normal: ['Open Sans', '-apple-system', 'sans-serif', 'Helvetica Neue'],
      header: ['Raleway', 'Open Sans', '-apple-system',  'sans-serif', 'Helvetica Neue'],
    },
    extend: {},
  },
  plugins: []
}
