const { ProvidePlugin, IgnorePlugin } = require('webpack');
const path = require('path')
const Dotenv = require('dotenv-webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')


const isProd = process.env.NODE_ENV === 'production'
const isEsbuild = process.env.ESBUILD_ENV

const filename = (ext) => isProd ? `[name].[contenthash:12]${ext}` : `[name]${ext}`

const config = {
    // context: path.resolve(__dirname, 'src'),
    mode: process.env.NODE_ENV,
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `static/js/${isProd ? '[name].[contenthash:12].js' : '[name].js'}`,
        assetModuleFilename: `static/images/${filename('[ext]')}`,
        clean: true,
        publicPath: '/',
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
        alias: {
            src: path.resolve(__dirname, 'src'),
            // добавить дополнительные alias по мере удобства для конкретного проекта
        }
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
        ].concat(isEsbuild ? (
            [
                new ESBuildMinifyPlugin({
                    legalComments: 'none',
                    minifyIdentifiers: true,
                    minifySyntax: true,
                    minifyWhitespace: true,
                    css: true,
                })
            ]
        ) : (
            [
                new CssMinimizerPlugin(),
                '...',
            ]
        ))
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
            filename: 'static/css/[name].[contenthash:12].css'
        }),
        new Dotenv(),
        new CaseSensitivePathsPlugin(),
        new IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new ProvidePlugin({
            React: 'react',
        })
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
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    // "postcss-loader"
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isProd ?
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '/'
                            }
                        } : "style-loader",
                    "css-loader",
                    // "postcss-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ],
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
                type: 'asset/inline',
                resourceQuery: /url/, // *.svg?url - замена url-loader
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                resourceQuery: {not: [/url/, /nc/]},
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
                test: /\.(ttf|eot|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `static/fonts/${filename('[ext]')}`
                }
            },
        ].concat(isEsbuild ? (
            [
                {
                    test: /\.(js|jsx)?$/,
                    loader: 'esbuild-loader',
                    exclude: /node_modules/,
                    options: {
                        loader: 'jsx',
                        target: 'es2015'
                    }
                },
            ]
        ) : (
            [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
            ]
        ))
    }
}

module.exports = config