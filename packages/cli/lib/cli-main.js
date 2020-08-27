"use strict";

const yeoman = require("yeoman-environment");
const camelCaseKeys = require("camelcase-keys");
const path = require("path");
const debug = require("debug");
const PREFIX = "vue-easy:";
const pkg = require("../package.json");

function setupGenerators() {
	const env = yeoman.createEnv();
	env.register(
		path.join(__dirname, "../generators/create"),
		PREFIX + "create",
	);
	return env;
}

function printCommands(env, log) {
	log("Available commands:");
	const prefix = "  vue-easy ";

	const generatorCommands = Object.keys(env.getGeneratorsMeta())
		.filter(name => /^vue-easy:/.test(name))
		.map(name => name.replace(/^vue-easy:/, prefix));

	const list = [...generatorCommands];
	log(list.join("\n"));
}

function main(opts) {
	const log = console.log;
	const env = setupGenerators();

	// list generators
	if (opts.commands) {
		printCommands(env, log);
		return;
	}

	if (opts.version) {
		log(pkg.version);
		return;
	}

	// run command
	const args = opts._;
	const originalCommand = args.shift();
	let command = PREFIX + (originalCommand || "create");
	const supportedCommands = env.getGeneratorsMeta();
	if (!(command in supportedCommands)) {
		command = PREFIX + "create";
		args.unshift(originalCommand);
		args.unshift(command);
	} else {
		args.unshift(command);
	}

	const options = camelCaseKeys(opts, {exclude: ["--", /^\w$/, "argv"]});
	Object.assign(options, opts);
	debug("env.run %j %j", args, options);
	env.run(args, options);

	// list generators
	if (opts.help && !originalCommand) {
		printCommands(env, log);
	}
}

module.exports = main;
