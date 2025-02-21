// //
// //
// // const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
// //     TerserPlugin = require("terser-webpack-plugin"),
// //     path = require("path"),
// //     common = require("./webpack.common.js");
// // const { merge } = require("webpack-merge"),
// //     CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// // const WorkboxPlugin = require("workbox-webpack-plugin");
// //
// // module.exports = merge(common, {
// //   mode: "production",
// //   devtool: "hidden-source-map",
// //   module: {
// //     rules: [
// //       {
// //         test: /\.s[ac]ss$/i,
// //         use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
// //       },
// //     ],
// //   },
// //   output: {
// //     filename: "bundle.[contenthash].js",
// //     path: path.resolve(__dirname, "dist"),
// //     libraryTarget: "var",
// //     library: "Client",
// //     clean: true,
// //   },
// //   optimization: {
// //     minimize: true,
// //     minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
// //     splitChunks: {
// //       chunks: "all",
// //     },
// //   },
// //   plugins: [
// //     new MiniCssExtractPlugin({
// //       filename: "style.[contenthash].css",
// //     }),
// //     new WorkboxPlugin.GenerateSW({
// //       clientsClaim: true,
// //       skipWaiting: true,
// //       runtimeCaching: [
// //         {
// //           urlPattern: ({ request }) => request.destination === "image",
// //           handler: "CacheFirst",
// //           options: {
// //             cacheName: "images",
// //             expiration: {
// //               maxEntries: 50,
// //               maxAgeSeconds: 30 * 24 * 60 * 60, // شهر
// //             },
// //           },
// //         },
// //         {
// //           urlPattern: ({ url }) => url.pathname.endsWith(".js"),
// //           handler: "StaleWhileRevalidate",
// //           options: {
// //             cacheName: "scripts",
// //           },
// //         },
// //       ],
// //     }),
// //   ],
// // });
// const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
//     TerserPlugin = require("terser-webpack-plugin"),
//     path = require("path"),
//     common = require("./webpack.common.js");
// const { merge } = require("webpack-merge"),
//     CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const WorkboxPlugin = require("workbox-webpack-plugin");
//
// module.exports = merge(common, {
//   mode: "production",

const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    TerserPlugin = require("terser-webpack-plugin"),
    path = require("path"),
    common = require("./webpack.common.js");
const { merge } = require("webpack-merge"),
    CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "hidden-source-map",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "Client",
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: ({ url }) => url.pathname.endsWith(".js"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "scripts",
          },
        },
      ],
    }),
  ],
});