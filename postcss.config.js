module.exports = {
  ident: 'postcss', // Necessary for external CSS imports to work
  parser: false,
  plugins: {
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    },
  },
};
