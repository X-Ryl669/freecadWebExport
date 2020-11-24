const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");


module.exports = {
  entry: {
    'freecadGLTF': './src/index.js',
    'freecadGLTF.min': './src/index.js',
    'styles': './css/iframe.css',
  },
  module: {
    rules: [
      {test: /\.css$/,
       use: [MiniCssExtractPlugin.loader,"css-loader"]
      }
    ]
  },
  plugins: [
     new CleanWebpackPlugin(),
     new MiniCssExtractPlugin({filename: "freecadGLTF.min.css"}),
     new FixStyleOnlyEntriesPlugin(),
     new OptimizeCSSAssetsPlugin({})
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/
    })],
  },
};
