const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { webpackConfig } = require("./webpack.common");

module.exports = merge(webpackConfig, {
  mode: 'development',
  output: {
    pathinfo: true,
    path: path.resolve(process.cwd(), "dist"),  /* can add version "version&&isString(version)?`dist/${version}`:'dist'" */
    filename: `js/[name].js`,
    chunkFilename: '[name].chunk.js',
    publicPath: "/"
  },
  devtool: 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      }, {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}
)