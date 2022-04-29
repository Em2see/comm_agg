// In webpack.config.js
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//var cpx = require('cpx')
const WebpackShellPlugin = require('webpack-shell-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//we need to create two versions of production

module.exports = (env) => ({
	  entry: {
		index:'./dev/app/index.jsx'
	  },
	  output: {
		path: __dirname + '/build/test' + env.BUILD_SUFFIX,
		filename: "index_bundle.js"
	  },
	  resolve: {
		alias: {
		  'react': __dirname + '/node_modules/react'
		},
		extensions: ['*', '.js', '.jsx']
	  },
	  mode: 'development',
      devtool: 'source-map',
	  module: {
		
		rules: [
			{test: /\.jsx?$/, exclude: /node_modules/, 
                loader: 'babel-loader' , 
                options: {
                    presets: [
                        ["env", {
                          "targets": {
                            // The % refers to the global coverage of users from browserslist
                            "browsers": { 
                                "chrome": "66", 
                                "ff": "48"
                                }
                          }
                        }
                        ],
                    "es2015", "react", "stage-0"]
                }
            },
			{test: /\.css$/, exclude: /node_modules/, 
                loader: 'css-loader'
                                
            },
			{
				test: /\.(png|eot|woff|woff2|ttf|svg)$/,
				exclude: /node_modules/,
				loader: 'url-loader', 
				options: { limit: 100000 }
			},
			{
				test: /\.jpg$/,
				loader: 'file-loader'
			}
		]
	  },
	  plugins: [
		new HtmlWebpackPlugin({
		  template: __dirname + '/dev/view/index.html',
		  filename: __dirname + '/build/prod' + env.BUILD_SUFFIX + '/index.html',
		  inject: 'body'
		}),
		new webpack.DefinePlugin({
		  'process.env':{
			'NODE_ENV': JSON.stringify('testing'),
			'DEF_PATH_ENV': env.DEF_PATH_ENV,
		  }
		}),
        
        new WebpackShellPlugin({
			onBuildStart: ['echo "Starting"'],
			onBuildEnd: ['node copy_instructions.js']
		})
		]
})

