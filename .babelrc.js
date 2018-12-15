module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    {
      targets: {
        browsers: ['last 2 versions', 'ie >= 10']
      }
    }
  ]
};
