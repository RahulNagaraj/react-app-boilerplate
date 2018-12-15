const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.normalize('./src/index.js'), // entry point to app
  output: {
    path: path.resolve(__dirname, 'dist'), // output to /dist
    filename: '[name].js' // output filename - index.js
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              import: true,
              sourceMap: true,
              url: true
            }
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  mode: 'development'
};
