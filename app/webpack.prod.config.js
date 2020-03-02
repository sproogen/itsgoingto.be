const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
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
    })
  ]
})
