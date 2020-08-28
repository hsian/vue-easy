#!/usr/bin/env node
'use strict';

const spawn = require('cross-spawn');
const args = process.argv.slice(2);
const scriptIndex = args.findIndex( v => (
	v === 'build' || v === 'dev' ||  v === 'test' ||  v === 'dist'
));
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

// command -d build => ['-d']
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

switch(script){
    case '-v':
        const pkg = require('./package.json');
        console.log(pkg.version);
        break;
    case 'build':
    case 'dev':
	case 'test':
    case 'dist':
        // exect child_process use spawn
        const result = spawn.sync(
            // command
            'node',
			// command args
			nodeArgs
				.concat(require.resolve('./scripts/' + script))
				.concat(args.slice(scriptIndex + 1)),
			{stdio: 'inherit'}
        )
        console.log(result.signal);
        process.exit(result.status);
        break;
    default:
        console.log(`Unknown script ${script}.`);
		break;
}