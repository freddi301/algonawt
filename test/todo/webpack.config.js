const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js?$/, loader: 'babel-loader', exclude: [path.resolve(__dirname, '../../node_modules')] }
    ]
  }
};
