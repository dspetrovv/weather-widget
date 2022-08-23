const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const dotenv = require('dotenv')

dotenv.config()

let isDev = process.env.NODE_ENV === 'development'
let isProd = !isDev

function getFilename(extension) {
  return isDev ? `[name].${extension}` : `weather-widget.${extension}`
}

function optimize() {
  let optimizationConfig = {
    splitChunks: {
      chunks: 'all',
    },
  }

  if (isProd) {
    optimizationConfig.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return optimizationConfig
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './main.ts',
  output: {
    filename: getFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.js', '.ts', '.vue', '.ce.vue' ],
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  optimization: optimize(),
  devServer: {
    port: 8080,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './assets/index.html',
      favicon: './assets/favicon.ico',
      minify: isProd,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: getFilename('css')
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(vue|ce.vue)$/,
        use: ['vue-loader'],
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.(vue|ce.vue)$/] },
        },
      },
    ],
  },
}