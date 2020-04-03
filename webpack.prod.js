const merge = require("webpack-merge");
const common = require("./webpack.common");
const package = require("./package.json");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: package.name + ".min.js"
  },
  devtool: "source-map"
});
