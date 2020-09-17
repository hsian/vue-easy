'use strict';

const webpackConfig = require('./webpack.development');

const urlConfig = {
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  protocol: process.env.HTTPS === 'true' ? 'https' : 'http'
}

const createDevServerConfig = function() {
	return {
		clientLogLevel: 'warning',
		hot: true,
		//open: false,
		contentBase: webpackConfig.output.path,
		watchContentBase: true,
		compress: true,
		host: urlConfig.host,
		port: urlConfig.port,		
		overlay: { warnings: false, errors: true },
		publicPath: webpackConfig.output.publicPath,
	    quiet: true,
	    https: urlConfig.protocol === 'https',
	    historyApiFallback: true,
	}
}

module.exports = {
  urlConfig,
  createDevServerConfig
}