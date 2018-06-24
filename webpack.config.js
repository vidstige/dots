module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: __dirname + "/build",
    publicPath: '/build/',
    filename: "bundle.js"
  }
};