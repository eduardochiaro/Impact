/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./**/*.hbs"],
  theme: {
    colors: {
      amber: colors.amber,
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
