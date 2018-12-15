const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Simplifies creation of HTML files to serve your webpack bundles
const CleanWebpackPlugin = require('clean-webpack-plugin'); // Plugin to remove your build folder(s) before building
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';

// style files regexes
const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        config: {
          path: path.join(__dirname, 'postcss.config')
        }
      }
    }
  ];
  if (preProcessor) {
    loaders.push(require.resolve(preProcessor));
  }
  return loaders;
};

module.exports = {
  entry: path.join(__dirname, 'src/index.js'), // Entry point to the app,
  output: {
    path: path.resolve(__dirname, 'build/js'), // Output to /build
    filename: '[name].bundle.js', // Output filename - main.bundle.js
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
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            options: {
              configFile: '.eslintrc.js',
              emitError: true,
              eslintPath: require.resolve('eslint'),
              failOnError: true
            },
            loader: require.resolve('eslint-loader')
          }
        ]
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'build/assets/[name].[ext]'
            }
          },
          // Process application JS with Babel.
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src'),
            loader: 'babel-loader',
            options: {
              babelrc: true,
              configFile: path.join(__dirname, '.babelrc.js'),
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // Don't waste time on Gzipping the cache
              cacheCompression: false
            }
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // in development "style" loader enables hot editing of CSS.
          {
            test: cssRegex,
            use: getStyleLoaders({
              importLoaders: 1
            })
          },
          // Opt-in support for SASS (using .scss or .sass extensions).
          // Chains the sass-loader with the css-loader and the style-loader
          // to immediately apply all styles to the DOM.
          {
            test: sassRegex,
            use: getStyleLoaders({ importLoaders: 2 }, 'sass-loader')
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'build/assets/[name].[ext]'
            }
          }
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
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
    new InterpolateHtmlPlugin({
      PUBLIC_URL: process.env.PUBLIC_URL || publicUrl
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
      publicPath: publicPath
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
