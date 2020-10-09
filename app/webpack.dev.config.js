const merge = require('webpack-merge')
const common = require('./webpack.common.config.js')

const PORT = parseInt(process.env.PORT, 10) || 3000

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: PORT,
    historyApiFallback: true,
  },
})
