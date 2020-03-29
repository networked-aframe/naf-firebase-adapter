const path = require("path");
const package = require("./package.json");

module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    filename: package.name + ".js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
