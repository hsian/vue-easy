#!/usr/bin/env node
const minimist = require("minimist");
const opts = minimist(process.argv.slice(2), {
	alias: {
		version: "v", // --version or -v: print versions
		commands: "l", // --commands or -l: print commands
		help: "h", // --help or -h: help
	},
});

const main = require("../lib/cli-main");
main(opts);
