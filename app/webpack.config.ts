import path from 'path'
import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import postCSSFlexbugsFixes from 'postcss-flexbugs-fixes'
import postCSSPresetEnv from 'postcss-preset-env'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const publicURL = process.env.PUBLIC_URL || ''
const PORT = parseInt(process.env.PORT || '', 10) || 3000
const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || '', 10) || PORT
const production = process.env.NODE_ENV === 'production'
const development = process.env.NODE_ENV === 'development'

const config: webpack.Configuration = {
  mode: production ? 'production' : 'development',
  devtool: production ? 'source-map' : 'inline-source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      routes: path.resolve(__dirname, 'src/routes'),
      services: path.resolve(__dirname, 'src/services'),
      styles: path.resolve(__dirname, 'src/styles'),
      store: path.resolve(__dirname, 'src/store'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
    }),
    new MiniCssExtractPlugin({
      filename: production ? 'static/css/style.[contenthash].css' : 'static/css/style.css',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicURL,
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'public'),
      to: path.resolve(__dirname, 'dist'),
    }]),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    ...production ? [
      new WebpackManifestPlugin({ fileName: 'asset_manifest.json' }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        logLevel: 'silent',
      }),
    ] : [],
    ...development ? [
      new WatchMissingNodeModulesPlugin(path.resolve('node_modules')),
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
      sockPort: SOCKET_PORT,
      historyApiFallback: true,
    },
  } : {},
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
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
                includePaths: [path.resolve(__dirname, 'src/styles')],
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postCSSFlexbugsFixes,
                postCSSPresetEnv(),
              ],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/static/media',
            },
          },
        ],
      },
    ],
  },
}

export default config
