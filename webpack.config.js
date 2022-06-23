const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
require("dotenv").config();
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')


const isProd = process.env.NODE_ENV === 'production'

const filename = (ext) => isProd ? `[name].[contenthash]${ext}` : `[name]${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: process.env.NODE_ENV,
    entry: {
        bundle: './index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `static/js/${isProd ? '[name].[contenthash].js' : '[name].js'}`,
        assetModuleFilename: `static/images/${filename('[ext]')}`,
        clean: true,
        publicPath: '',
    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, 'build'),
        },
        open: true,
        compress: true,
        hot: true,
        port: 'auto',
    },
    devtool: isProd ? false : 'source-map',
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            '...',
            // раскомментировать, если нужна оптимизация изображений без потери качества,
            // Но я предпочитаю сжимать сам, т.к сжимается гораздо лучше, чем через ImageMinimizerPlugin
            // new ImageMinimizerPlugin({
            //     minimizer: {
            //         implementation: ImageMinimizerPlugin.imageminMinify,
            //         options: {
            //             plugins: [
            //                 ["gifsicle", { interlaced: true }],
            //                 ["jpegtran", { progressive: true }],
            //                 ["optipng", { optimizationLevel: 5 }],
            //             ]
            //         }
            //     }
            // })
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: isProd ? (
                {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                    useShortDoctype: true
                }
            ) : false
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/style.css'
        }),
        new Dotenv(),
        new CaseSensitivePathsPlugin(),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, 'src/assets'),
        //             to: path.resolve(__dirname, 'build/assets')
        //         }
        //     ]
        // })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    esModule: true,
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return '../' + path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    },
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|webp)$/,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/i,
                type: 'asset/resource',
                resourceQuery: /nc/, // *.svg?nc - Чтобы webpack не делал svg react компонентом
            },
            {
                test: /\.svg$/i,
                type: 'asset',
                resourceQuery: /url/, // *.svg?url - замена url-loader
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                resourceQuery: { not: [/url/, /nc/] },
                use: ['@svgr/webpack']
            },
            {
                test: /\.ico$/,
                type: 'asset/resource',
                generator: {
                    filename: `favicon.ico`
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: `static/fonts/${filename('[ext]')}`
                }
            }
        ]
    }
}