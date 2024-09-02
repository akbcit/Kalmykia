const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts', // Entry point for your application
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader', // Use ts-loader for TypeScript files
        exclude: /node_modules/, // Exclude node_modules
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
  },
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before each build
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Specify a template if necessary
      title: 'Kalmykia Game Engine',
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve static files from dist
    },
    compress: true, // Enable gzip compression
    port: 9000, // Port to run the dev server on
    hot: true, // Enable hot module replacement
    open: true, // Automatically open the browser
  },
};
