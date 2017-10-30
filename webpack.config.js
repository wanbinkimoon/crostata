const webpack = require('webpack')

module.exports = {
  context: __dirname + "/src",
  entry: "./js/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "./js/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }, {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      }, {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}