'use strict'

const path = require("path");
const {merge} = require('webpack-merge')
const webpack = require('webpack');
const { webpackConfig } = require("./webpack.common");
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = merge(webpackConfig, {
	mode: 'production',
	output:{
  		pathinfo: false,
		path: path.resolve(process.cwd(), "dist"),  
		filename: `js/[name].js`,
		chunkFilename: 'vendors/js/[name].chunk.js',
		publicPath: `/`
  	},
	devtool: "none",
	module: {
		rules: [
			{
				test: /\.css?$/,
				use: [
			  		MiniCssExtractPlugin.loader, 
			  		'css-loader'
				]
			}, {
				test: /\.styl(us)?$/,
				use: [
		  			MiniCssExtractPlugin.loader, 
		  			'css-loader', 
		  			'stylus-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
      		// both options are optional
      		filename: 'css/[name].[contenthash:8].css',
      		chunkFilename: 'css/[name].chunk.css',
		}),
		new ManifestPlugin({
	    	fileName: 'asset-manifest.json',
	    }),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	]

})