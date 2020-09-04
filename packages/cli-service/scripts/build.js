'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const fs = require('fs-extra');

const webpackConfig = require('../config/webpack.production');
const formatWebpackMessages = require('./utils/formatWebpackMessages');

const compiler = webpack(webpackConfig);

// start build
console.log(
	chalk.cyan('Creating an optimized production build...')
);

function preCompiler(){
	return new Promise((resolve, reject) => {
		fs.emptyDirSync(path.resolve(process.cwd(), "dist"));
		resolve();
	})
}

function build(){
	// build
	compiler.run((err, stats) => {
		if(err){
			return console.log(err);
		}
		const messages = formatWebpackMessages(stats.toJson({}, true));

		// errors
		if (messages.errors.length) {
		    // Only keep the first error. Others are often indicative
		    // of the same problem, but confuse the reader with noise.
		    if (messages.errors.length > 1) {
		      messages.errors.length = 1;
		    }
		    throw new Error(messages.errors.join('\n\n'));
		    return;
		}

		// warnings
		if (messages.warnings.length){
			throw new Error(messages.warnings.join('\n\n'));
	        return;
		}
		console.log(chalk.green('Compiled successfully.\n'));
		process.exit();
	})
}

preCompiler().then(() => {
	build();
}).catch(err => {
	if (err && err.message) {
    	console.log(err.message);
    }
    process.exit(1);
})