const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "index.js",
  },
};
