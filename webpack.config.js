const path = require('path');

module.exports = {
  entry: {
    bot: './public/main.js',
    embed: './public/embed/embed.js',
    pushnotication: './public/pushNotification/push/index.js'
  },
  devtool: 'eval-source-map',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public','bundle'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  watch: true
};