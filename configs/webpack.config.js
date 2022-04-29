// In webpack.config.js
var webpack = require('webpack')
var proxyserver = 'http://localhost:3000/'
var HtmlWebpackPlugin = require('html-webpack-plugin')
const RunNodeWebpackPlugin = require('run-node-webpack-plugin');
const path = require('path')

module.exports = env => ({
    entry: ['dev/app/index.jsx'],
    output: {
        path: path.resolve(__dirname, '../', env.BUILD_DIR, env.BUILD_SUFFIX),
        filename: "index_bundle.js",
        publicPath: "/",
    },
    resolve: {
        alias: {
            'react': 'node_modules/react'
        },
        extensions: ['*', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, '../node_modules'),
            path.resolve(__dirname, '../')
        ]
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        host: '127.0.0.1',
        port: '9090',
        static: {
            directory: path.join(__dirname, '../public'),
        },
        headers: { "Access-Control-Allow-Origin": proxyserver, "Access-Control-Allow-Credentials": "true" },
        proxy: [{
                context: '/Remarks',
                target: proxyserver,
                secure: false,
                logLevel: 'debug'
            },
            {
                context: '/Remarks2',
                target: proxyserver,
                secure: false,
                logLevel: 'debug'
            }
        ],
        historyApiFallback: {
            rewrites: [{
                    from: /index_bundle.js$/,
                    to: context => {
                        console.log(JSON.stringify(context))
                        return '/index_bundle.js'
                    }
                },
                {
                    from: /\/(\d\.)?index_bundle\.js(\.map)?/,
                    to: context => context.match[0]
                }
            ]
        }
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["@babel/preset-env",
                                {
                                    targets: {
                                        "ie": "11",
                                        "chrome": "66",
                                        "firefox": "48"
                                    }
                                }
                            ],
                            "@babel/preset-react"
                        ],
                        plugins: ["@babel/plugin-transform-object-assign",
                            "@babel/plugin-proposal-class-properties",
                            "babel-plugin-lodash",
                        ]
                    }
                }
            },
            {
                test: /\.(png|eot|woff|woff2|ttf|svg|jpg)$/,
                exclude: /node_modules/,
                loader: 'url-loader',
                options: { limit: 100000 }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'dev/app/index.html',
            filename: path.resolve(__dirname, '../', env.BUILD_DIR, env.BUILD_SUFFIX, 'index.html'),
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'DEF_PATH_ENV': `'${env.DEF_PATH_ENV}'`,
                'VERSION': "'NEW'"
            }
        }),
        new RunNodeWebpackPlugin({
            scriptToRun: './configs/server.js'
        })
    ],
    externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
        'react-addons-test-utils': 'react-dom',
    },
});