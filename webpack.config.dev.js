const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Simplifies creation of HTML files to serve your webpack bundles
const CleanWebpackPlugin = require('clean-webpack-plugin'); // Plugin to remove your build folder(s) before building

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.

module.exports = {
  entry: path.join(__dirname, 'src/index.js'), // Entry point to the app,
  output: {
    path: path.join(__dirname, 'build/js'), // Output to /build
    filename: '[name].bundle.js', // Output filename - index.bundle.js
    publicPath: publicPath // This is the URL that app is served from. We use "/" in development.
  },
  devServer: {
    contentBase: './build', // Serve the src folder
    historyApiFallback: true, // index.html to be served incase of 404
    hot: true, // Hot Module Replacement
    port: 8080 // Port to run on
  },
  devtool: 'cheap-eval-source-map', // Controls if and how source maps are generated
  mode: 'development',
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
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
    new CleanWebpackPlugin(['build']),
    new HtmlWebpackPlugin({
      inject: 'body', // Inject assets into the body
      template: path.join(__dirname, 'public/index.html') // Template to render
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
  }
};
