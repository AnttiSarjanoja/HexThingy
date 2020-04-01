const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: 'development',
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  devServer: {
    compress: true,
    port: 3000,
  },
}
