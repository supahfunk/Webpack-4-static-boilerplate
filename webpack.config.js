const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: ["babel-polyfill", "./src/index.js"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devtool: "source-map",
    devServer: {
        contentBase: "./dist"
    },
    optimization: {
        minimizer: [
            // new UglifyJsPlugin({
            //     // cache: true,
            //     // parallel: true,
            //     // sourceMap: true
            // }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: false,
                        interpolate: true,
                        attrs: [':data-src', ':src']
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|svg|gif|ico)/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "./img/[name].[ext]",
                            limit: 1000
                        }
                    },
                    {
                        loader: "img-loader"
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            optipng: {
                                enabled: true
                            },
                            pngquant: {
                                enabled: true,
                                quality: "80"
                            },
                            mozjpeg: {
                                progressive: true,
                                quality: 80
                            }
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "bundle.css",
            chunkFilename: "[id].css"
        }),
        new CopyPlugin([
            { from: 'src/fonts', to: 'fonts' },
        ]),
        new HtmlWebPackPlugin({
            filename: "./index.html",
            template: "src/pages/index.html",
            title: "Home",
            hash: true,
            chunks: ["app"]
        }),
    ]
};