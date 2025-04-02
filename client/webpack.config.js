const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "vm": require.resolve("vm-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "process": require.resolve("process"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};


module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        process: require.resolve("process/browser"),
      };
      return webpackConfig;
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  },
};
