const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Simplifies creation of HTML files to serve your webpack bundles
const CleanWebpackPlugin = require('clean-webpack-plugin'); // Plugin to remove your build folder(s) before building

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'src'), // Serve the src folder
    historyApiFallback: true, // index.html to be served incase of 404
    hot: true, // Hot Module Replacement
    port: 8080 // Port to run on
  },
  devTool: 'cheap-eval-source-map', // Controls if and how source maps are generated
  entry: {
    app: './src/index.js' // Entry point to the app
  },
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
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      inject: 'body', // Inject assets into the body
      template: './src/index.html' // Template to render
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  stats: {
    all: false, // Fallback value for stats options when an option is not defined
    errors: true, // Add errors
    errorDetails: true, // Add details to errors
    colors: true, // `webpack --colors` equivalent
    modules: true, // Add built modules information
    maxModules: 0, // Set the maximum number of modules to be shown
    warnings: true // Add warnings
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output to /dist
    filename: '[name].bundle.js' // Output filename - index.bundle.js
  }
};
