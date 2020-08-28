'use strict';
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const fs = require('fs-extra');

const webpackConfig = require('../config/webpack.component');
const webpackExtractConfig = require('../config/webpack.component.extract');
const formatWebpackMessages = require('./utils/formatWebpackMessages');

const compiler = webpack(webpackConfig);
const compilerExtract = webpack(webpackExtractConfig);

console.log(
	chalk.cyan('Creating an optimized components build...')
);

function preCompiler(){
	return new Promise((resolve, reject) => {
		fs.emptyDirSync(path.resolve(process.cwd(), './lib'));
		resolve();
	})
}

function printMessage(err, stats){
	return new Promise((resolove, reject) => {
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
		resolove();
	})
}

function build(){
	// build
	compiler.run((err, stats) => {
		printMessage(err, stats).then(() => {
			buildExtract();
		})
	})
}

function buildExtract(){
	// build extract
	compilerExtract.run((err, stats) => {
		printMessage(err, stats).then(() => {
			process.exit();
		})
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