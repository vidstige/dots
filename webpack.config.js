module.exports = {
  entry: "./index.js",
  mode: "development",
  output: {
    path: __dirname + "/build",
    publicPath: '/build/',
    filename: "bundle.js"
  }
};