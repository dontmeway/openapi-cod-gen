module.exports = {
  entry: "./src/index.js",
  mode: "development",
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
