const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/client/index.js",
    mode: "development", // يمكن تغييره إلى "production" عند بناء المشروع النهائي
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/", // تأكد من أن المسارات تعمل بشكل صحيح
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(css|scss)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // ✅ دعم تحميل الصور
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[hash][ext][query]", // ✅ حفظ الصور في مجلد مخصص داخل `dist`
                },
            },
        ],
    },
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()],
        minimize: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/views/index.html",
            filename: "index.html",
            inject: "body",
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css",
        }),
        new CleanWebpackPlugin(),
    ],
};

