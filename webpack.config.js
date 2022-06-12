const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')


const isMode = process.env.NODE_ENV === 'development'

const filename = (ext) => isMode ? `[name].${ext}` : `[name].[contenthash].${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: process.env.NODE_ENV,
    entry: {
        bundle: './js/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `./js/${filename('js')}`,
        assetModuleFilename: `./images/${filename('[ext]')}`,
        clean: true, 

    },
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.resolve(__dirname, 'build'),
        },
        open: true,  
        compress: true, 
        hot: true, 
        port: 3000
    },
    devtool: isMode ? 'source-map' : false,
    optimization: {
        minimizer: [new CssMinimizerPlugin()],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: !isMode
            }
        }),
        new MiniCssExtractPlugin({
            filename: './css/style.css'
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
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    },
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
                type: 'asset/resource', 
            },
            {
                test: /\.ico$/,
                type: 'asset/resource', 
                generator: {
                    filename: `./ico/${filename('ico')}`
                }
            },
            {
                test: /\.(ttf|eot|woff|svg|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: `./fonts/${filename('[ext]')}`
                }
            }
        ]
    }
}