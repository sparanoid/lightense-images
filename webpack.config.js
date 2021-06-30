const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');
const banner = `/*! ${ pkg.name } v${ pkg.version } | © ${ pkg.author } | ${ pkg.license } */`;
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        parallel: true,
        extractComments: false,
      })
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner,
      raw: true,
      entryOnly: true
    }),
    new ESLintPlugin({
      extensions: 'es'
    })
  ]
};
