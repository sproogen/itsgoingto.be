const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')

const publicURL = process.env.PUBLIC_URL || ''
const PORT = parseInt(process.env.PORT, 10) || 3000
const production = process.env.NODE_ENV === 'production'
const development = process.env.NODE_ENV === 'development'

module.exports = {
  mode: production ? 'production' : 'development',
  devtool: production ? 'source-map' : 'inline-source-map',
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      routes: path.resolve(__dirname, 'src/routes'),
      services: path.resolve(__dirname, 'src/services'),
      styles: path.resolve(__dirname, 'src/styles'),
      store: path.resolve(__dirname, 'src/store')
    },
    extensions: ['.js', '.jsx', '.scss']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    }),
    new MiniCssExtractPlugin({
      filename: production ? 'static/css/style.[contenthash].css' : 'static/css/style.css'
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicURL,
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'public'),
      to: path.resolve(__dirname, 'dist')
    }]),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    ...production ? [
      new ManifestPlugin({ fileName: 'asset_manifest.json' }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        logLevel: 'silent'
      }),
    ] : [],
    ...development ? [
      new WatchMissingNodeModulesPlugin(path.resolve('node_modules'))
    ] : [],
  ],
  output: {
    filename: production ? 'static/js/[name].[contenthash].js' : 'static/js/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  ...development ? {
    devServer: {
      contentBase: './dist',
      port: PORT,
      historyApiFallback: true,
    },
  } : {},
  module: {
    rules: [
      {
        test: /\.(bmp|gif|jpe?g|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]',
            outputPath: 'static/media'
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src/styles')]
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      },
      {
        test: /\.(jpg|gif|svg|woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/media'
            }
          }
        ]
      }
    ],
  }
}
