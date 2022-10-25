const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    library: { type: "commonjs-module" },
  },

  mode: "production",
  resolve: {
    extensions: [".js"],
    fallback: {
      fs: false,
      path: false,
      process: false,
      constants: false,
      stream: false,
      assert: false,
      util: false,
      url: false,
      https: false,
      http: false,
      os: false,
      child_process: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: "handlebars-loader",
      },
    ],
  },
};
