const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
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
    },
  },
};
