const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const bourbon = require('bourbon')
const bourbonNeat = require('bourbon-neat')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const getClientEnvironment = require('../config/env')
const paths = require('../config/paths')

const env = getClientEnvironment('')

module.exports = {
  resolve: {
    modules: [
      paths.appSrc,
      'node_modules',
    ],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
  },
  entry: [
    require.resolve('../config/polyfills'),
  ],
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
  },
  module: {
    rules: [
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: { limit: 8192 }
      },
      {
        test: /\.(js|jsx|mjs)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
        },
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              importLoaders: 1,
              includePaths: [
                bourbon.includePaths,
                bourbonNeat.includePaths,
                paths.styles,
              ],
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}