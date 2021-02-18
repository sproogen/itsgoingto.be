const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const common = require('./webpack.common.config.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new ManifestPlugin({ fileName: 'asset_manifest.json' }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      logLevel: 'silent'
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/style.[contenthash].css'
    }),
  ],
  output: {
    filename: 'static/js/[name].[contenthash].js',
  },
})
