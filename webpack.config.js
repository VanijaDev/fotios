const path = require("path");

var config = {
  // TODO: Add common Configuration
  module: {},
  mode: "development",
  devtool: 'eval-cheap-source-map'
};

var mainConfig = Object.assign({}, config, {
  name: "index",
  entry: "./web/src/index.js",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
  },
});

// Return Array of Configurations
module.exports = [
  mainConfig
];