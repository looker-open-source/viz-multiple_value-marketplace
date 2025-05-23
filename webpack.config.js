var path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

var webpackConfig = {
  mode: 'production',
  entry: {
    multiple_value: './src/multiple_value/multiple_value_container.js',
  },
  devServer: {
    contentBase: './dist',
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.join(path.resolve(__dirname), '/dist'),
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'},
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {loader: 'style-loader', options: {injectType: 'lazyStyleTag'}},
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/,
        loader: 'url-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {"buffer": false},
  },
  plugins: [new TerserPlugin()],
  stats: {},
};

module.exports = webpackConfig;
