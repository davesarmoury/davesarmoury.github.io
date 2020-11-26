module.exports = {
  purge : [ '../index.html', '../assets/*.js' ],
  darkMode : false, // or 'media' or 'class'
  theme : {
    extend : {
      colors : {
        primary : '#f7c680',
      },
      maxWidth : {
        '1/2' : '50%',
        '3/4' : '75%',
      },
    },
  },
  variants : {
    extend : {},
  },
  plugins : [],
}
