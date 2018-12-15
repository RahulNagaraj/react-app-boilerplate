const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'src'), // Serve the src folder
    historyApiFallback: true, // index.html to be served incase of 404
    hot: true, // Hot Module Replacement
    port: 8080 // Port to run on
  },
  entry: path.normalize('./src/index.js'), // entry point to app
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              import: true, // Enable/Disable @import handling
              sourceMap: true, // Enable/Disable Sourcemaps
              url: true // Enable/Disable url() handling
            }
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  output: {
    path: path.resolve(__dirname, 'dist'), // output to /dist
    filename: '[name].js' // output filename - index.js
  }
};
