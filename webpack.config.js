var webpack = require('webpack');
var path = require('path');
var pkg = require('./package.json');
var banner = `/*! ${ pkg.name } v${ pkg.version } | © ${ pkg.author } | ${ pkg.license } */`;

module.exports = {
  entry: {
    'lightense': './lightense.es6',
    'lightense.min': './lightense.es6',
  },
  output: {
    path: './',
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
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new webpack.BannerPlugin({
      banner: banner,
      raw: true,
      entryOnly: true
    })
  ]
};
