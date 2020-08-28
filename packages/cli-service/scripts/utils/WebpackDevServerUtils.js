'use strict';

const chalk = require('chalk');
const moment = require("moment");

function createCompiler(webpack, config, appName){
	let compiler;

	try {
    	compiler = webpack(config);
  	} catch (err) {
    	console.log(chalk.red('Failed to compile.'));
    	process.exit(1);
  	}

  	// "invalid" event fires when you have changed a file, and Webpack is
  	// recompiling a bundle
  	compiler.hooks.invalid.tap('invalid', () => {
    	console.log('Compiling...');
  	});

  	// "done" event fires when Webpack has finished recompiling the bundle.
  	compiler.hooks.done.tap('done', stats => {
	    try{
	      	console.log(`startTime: ${moment(stats.startTime).format("YYYY MM DD, h:mm:ss")}`);
	      	console.log(`endTime: ${moment(stats.endTime).format("YYYY MM DD, h:mm:ss")}`);
	      	console.log();
	      	console.log(chalk.green(`${appName} compiled done!`));
	    }catch(err){
	      	console.log(err)
	    }
  	})

  	return compiler;
}

module.exports = {
	createCompiler
}