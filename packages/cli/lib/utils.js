"use strict";
const readline = require("readline");
const validate = require("validate-npm-package-name");
const semver = require("semver");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const util = require("util");
const {spawnSync} = require("child_process");
const pascalCase = require("change-case").pascalCase;
const SG = require("strong-globalize");

// SG.SetRootDir(path.join(__dirname, ".."));
exports.g = new SG();

const toFileName = name => {
	return _.kebabCase(name).replace(/\-(\d+)$/g, "$1");
};

exports.toFileName = toFileName;
exports.pascalCase = pascalCase;

/**
 * Use readline to read text from stdin
 */
exports.readTextFromStdin = function () {
	const rl = readline.createInterface({
		input: process.stdin,
	});

	const lines = [];
	let err;
	return new Promise((resolve, reject) => {
		rl.on("SIGINT", () => {
			err = new Error("Canceled by user");
			rl.close();
		})
			.on("line", line => {
				if (line === "EOF") {
					rl.close();
				} else {
					lines.push(line);
				}
			})
			.on("close", () => {
				if (err) reject(err);
				else resolve(lines.join("\n"));
			})
			.on("error", e => {
				err = e;
				rl.close();
			});
	});
};

exports.validate = function (name) {
	const isValid = validate(name).validForNewPackages;
	if (!isValid) return "Invalid npm package name: " + name;
	return isValid;
};

/**
 * Check package.json and dependencies.json to find out versions for generated
 * dependencies
 */
exports.getDependencies = function () {
	const pkg = require("../package.json");
	let version = pkg.version;

	// Set it to be `^x.y.0`
	const NachtVersion =
		"^" + semver.major(version) + "." + semver.minor(version) + ".0";

	const deps = {};
	const dependencies = (pkg.config && pkg.config.templateDependencies) || {};
	for (const i in dependencies) {
		// Default to version if the version for a given dependency is ""
		deps[i] = dependencies[i] || NachtVersion;
	}
	return deps;
};

exports.validateNotExisting = function (projDir) {
	if (fs.existsSync(projDir)) {
		return util.format("Directory %s already exists.", projDir);
	}
	return true;
};

/**
 * Check if `yarn` is installed
 */
exports.isYarnAvailable = function () {
	let yarnInstalled = spawnSync("yarn", ["-h"], {stdio: false}).status === 0;
	return yarnInstalled;
};

/**
 * Converts a name to class name after validation
 */
exports.toClassName = function (name) {
	if (name === "") return new Error("no input");
	if (typeof name != "string" || name == null) return new Error("bad input");
	return pascalCase(_.camelCase(name));
};
