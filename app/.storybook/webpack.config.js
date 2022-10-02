const path = require('path')
const custom = require('../webpack.config.js')

module.exports = async ({ config, mode }) => {
  return {
    ...config,
    resolve: { ...config.resolve, alias: { ...config.resolve.alias, ...custom.resolve.alias } },
    module: { ...config.module, rules: custom.module.rules }
  }
}
