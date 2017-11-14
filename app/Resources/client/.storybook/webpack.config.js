const path = require('path')
const webpack = require('webpack')
const bourbon = require('bourbon')
const bourbonNeat = require('bourbon-neat')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('../project.config')

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)

const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production'

const extractStyles = new ExtractTextPlugin({
  filename: 'styles/[name].[contenthash].css',
  allChunks: true,
  disable: true,
})

module.exports = {
  resolve: {
    modules: [
      inProject(project.srcDir),
      'node_modules',
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
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
        test: /\.(sass|scss|css)$/,
        loader: extractStyles.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: project.sourcemaps,
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                  discardComments: {
                    removeAll : true,
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourcemap: project.sourcemaps,
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: project.sourcemaps,
                includePaths: [
                  bourbon.includePaths,
                  bourbonNeat.includePaths,
                  inProjectSrc('styles'),
                ],
              },
            },
          ],
        })
      }
    ]
  },
  plugins: [
    extractStyles,
    new webpack.DefinePlugin(Object.assign({
      'process.env': { NODE_ENV: JSON.stringify(project.env) },
      __DEV__,
      __TEST__,
      __PROD__,
    }, project.globals))
  ]
}
