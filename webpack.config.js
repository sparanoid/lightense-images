const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const banner = `/*! ${ pkg.name } v${ pkg.version } | © ${ pkg.author } | ${ pkg.license } */`;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'lightense': './lightense.es6',
    'lightense.min': './lightense.es6',
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'Lightense'
  },
  module: {
    rules: [
      {
        test: /\.es6$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: [
          'babel-loader',
          'eslint-loader'
        ],
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        cache: true,
        parallel: true,
        uglifyOptions: {
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner,
      raw: true,
      entryOnly: true
    })
  ]
};
