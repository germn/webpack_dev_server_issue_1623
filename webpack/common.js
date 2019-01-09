const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = () => {
    const static_src_dir = path.resolve('./static_src/');
    const static_meta_dir = path.resolve('./static_meta/');
    const static_dir = path.resolve('./static/');

    const entry_file = path.resolve('./static_src/entry.js');
    const manifest_file = path.resolve('./static_meta/manifest.json');
    const tags_file = path.resolve('./static_meta/tags.html');


    return {
        resolve: {
            modules: [
                path.resolve('node_modules'),
            ]
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.js$/,
                            include: static_src_dir,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env']
                                }
                            }
                        },
                        {
                            test: /\.(css|sass|scss)$/,
                            include: static_src_dir,
                            use: [
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 2  // = postcss + sass
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        ident: 'postcss',
                                        plugins: [
                                            require('postcss-normalize')({}),
                                            require('postcss-preset-env')({}),
                                            require('autoprefixer')({})
                                        ]
                                    }
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        includePaths: ['./node_modules']
                                    }
                                }
                            ]
                        },
                        {
                            include: static_src_dir,
                            use: {
                                loader: 'file-loader',
                                options: {
                                    name: '[path][name].[hash:8].[ext]',  // hash === contenthash
                                    context: static_src_dir
                                }
                            },
                        },
                    ]
                }
            ]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    'vendor': {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        enforce: true,
                    },
                }
            }
        },
        entry: {
            'bundle': entry_file
        },
        output: {
            path: static_dir,
            filename: '[name].[contenthash:8].js',
            chunkFilename: 'chunk-[id].[contenthash:8].js'
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin(),  // To keep names for unchanged bundles.

            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css',
                chunkFilename: 'chunk-[id].[contenthash:8].css',
            }),

            new WebpackAssetsManifest({
                output: manifest_file,
                writeToDisk: true
            }),

            // Order is important!
            new HtmlWebpackPlugin({
                template: path.resolve('./utils/template.js'),
                filename: tags_file,
                inject: 'head',
                alwaysWriteToDisk: true
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            new HtmlWebpackHarddiskPlugin(),

            new CleanWebpackPlugin([
                static_dir,
                static_meta_dir
            ], {
                allowExternal: true
            }),
        ],
    }
};