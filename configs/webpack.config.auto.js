const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let common_config = (env) => (targets) => ({
    entry: 'dev/app/index.jsx',
    output: {
        path: path.resolve(__dirname, '../', env.BUILD_DIR, env.BUILD_SUFFIX),
        filename: targets.out_filename
    },
    node: {
        __dirname: false
    },
    resolve: {
        alias: {
            'react': 'node_modules/react'
        },
        extensions: ['*', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, '../node_modules'),
            path.resolve(__dirname, '../'),
        ]
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["@babel/preset-env", { targets: targets.browser_options }],
                        "@babel/preset-react"
                    ],
                    plugins: ["@babel/plugin-transform-object-assign",
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'resolve-url-loader'],
                include: [
                    /node_modules/
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'dev/app/index.html',
            filename: path.resolve(__dirname, '../', env.BUILD_DIR, env.BUILD_SUFFIX, 'index.html'),
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            DEF_PATH_ENV: env.DEF_PATH_ENV,
            TMP_NODE_ENV: JSON.stringify('testing'),
            NODE_ENV: env.NODE_ENV,
            'process.env': {
                'TMP_NODE_ENV': JSON.stringify('production'),
                //'NODE_ENV': JSON.stringify(env.NODE_ENV),
                'VERSION': "'NEW'",
                'DEF_PATH_ENV': JSON.stringify(env.DEF_PATH_ENV),
            }
        }),
        ...targets.plugins
    ]
})

const targets = (env) => [{
    browser_options: {
        chrome: 77
    },
    out_filename: 'index_bundle.js',
    plugins: []
}]

module.exports = (env) => {

    return targets(env).map(target => {
        let cfg = common_config(env)(target)
        if (env.PROD) {
            cfg = {...cfg, mode: 'production' }
        } else {
            cfg = {...cfg, mode: 'development', devtool: 'source-map' }
            cfg.module.rules = [...cfg.module.rules]
        }
        return cfg
    })
}