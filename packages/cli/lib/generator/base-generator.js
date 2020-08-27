"use strict";

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const debug = require("debug")("base-generator");
const {readTextFromStdin, g} = require("../utils");
const supportedPackageManagers = ["npm", "yarn"];

module.exports = class BaseGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		debug("Initializing generator", this.constructor.name);
		this._setupGenerator();
	}

	_setupGenerator() {
		debug(
			"Try overwrite yeoman messages globally",
			this._options["help"].description,
		);

		this.option("config", {
			type: String,
			alias: "c",
			description: g.f("JSON file name or value to configure options"),
		});

		this.option("yes", {
			type: Boolean,
			alias: "y",
			description: g.f(
				"Skip all confirmation prompts with default or provided value",
			),
		});

		this.option("packageManager", {
			type: String,
			description: g.f("Change the default package manager"),
			alias: "npm",
		});
	}

	async _readJSONFromStdin() {
		debug("Reading JSON from stdin");
		if (process.stdin.isTTY) {
			this.log(
				chalk.green(
					"Please type in a json object line by line " +
						"(Press <ctrl>-D or type EOF to end):",
				),
			);
		}

		let jsonStr;
		try {
			jsonStr = await readTextFromStdin();
			debug(
				"Result:",
				jsonStr === undefined ? "(undefined)" : JSON.stringify(jsonStr),
			);
			return JSON.parse(jsonStr);
		} catch (e) {
			if (!process.stdin.isTTY) {
				debug(e, jsonStr);
			}
			throw e;
		}
	}

	// handle cmd line args like --config / --yes
	async setOptions() {
		let opts = {};
		const jsonFileOrValue = this.options.config;
		debug(
			"Loading generator options from CLI args and/or stdin.",
			...(this.option.config === undefined
				? ["(No config was provided.)"]
				: ["Config:", this.options.config]),
		);
		try {
			if (
				jsonFileOrValue === "stdin" ||
				(!jsonFileOrValue && !process.stdin.isTTY)
			) {
				debug("  enabling --yes and reading config from stdin");
				this.options["yes"] = true;
				opts = await this._readJSONFromStdin();
			}
		} catch (e) {
			this.exit(e);
			return;
		}
		if (typeof opts !== "object") {
			this.exit("Invalid config file or value: " + jsonFileOrValue);
			return;
		}

		for (const o in opts) {
			if (this.options[o] == null) {
				this.options[o] = opts[o];
			}
		}

		const packageManager =
			this.options.packageManager ||
			this.config.get("packageManager") ||
			"npm";
		if (!supportedPackageManagers.includes(packageManager)) {
			const supported = supportedPackageManagers.join(" or ");
			this.exit(
				`Package manager '${packageManager}' is not supported. Use ${supported}.`,
			);
		}
	}

	_isQuestionOptional(question) {
		return (
			question.default != null || // Having a default value
			this.options[question.name] != null || // Configured in options
			question.type === "list" || // A list
			question.type === "rawList" || // A raw list
			question.type === "checkbox" || // A checkbox
			question.type === "confirm"
		); // A confirmation
	}

	async _getDefaultAnswer(question, answers) {
		// First check existing answers
		let defaultVal = answers[question.name];
		if (defaultVal != null) return defaultVal;

		// Now check the `default` of the prompt
		let def = question.default;
		if (typeof question.default === "function") {
			def = await question.default(answers);
		}
		defaultVal = def;

		if (question.type === "confirm") {
			return defaultVal != null ? defaultVal : true;
		}
		if (question.type === "list" || question.type === "rawList") {
			// Default to 1st item
			if (def == null) def = 0;
			if (typeof def === "number") {
				// The `default` is an index
				const choice = question.choices[def];
				if (choice) {
					defaultVal = choice.value || choice.name;
				}
			} else {
				// The default is a value
				if (
					question.choices.map(c => c.value || c.name).includes(def)
				) {
					defaultVal = def;
				}
			}
		} else if (question.type === "checkbox") {
			if (def == null) {
				defaultVal = question.choices
					.filter(c => c.checked && !c.disabled)
					.map(c => c.value || c.name);
			} else {
				defaultVal = def
					.map(d => {
						if (typeof d === "number") {
							const choice = question.choices[d];
							if (choice && !choice.disabled) {
								return choice.value || choice.name;
							}
						} else {
							if (
								question.choices.find(
									c =>
										!c.disabled &&
										d === (c.value || c.name),
								)
							) {
								return d;
							}
						}
						return undefined;
					})
					.filter(v => v != null);
			}
		}
		return defaultVal;
	}

	async prompt(questions) {
		// Normalize the questions to be an array
		if (!Array.isArray(questions)) {
			questions = [questions];
		}
		if (!this.options["yes"]) {
			if (!process.stdin.isTTY) {
				const msg =
					"The stdin is not a terminal. No prompt is allowed. " +
					"Use --config to provide answers to required prompts and " +
					"--yes to skip optional prompts with default answers";
				this.log(chalk.red(msg));
				this.exit(new Error(msg));
				return;
			}
			// Non-express mode, continue to prompt
			debug("Questions", questions);
			const answers = await super.prompt(questions);
			debug("Answers", answers);
			return answers;
		}

		const answers = Object.assign({}, this.options);

		for (const q of questions) {
			let when = q.when;
			if (typeof when === "function") {
				when = await q.when(answers);
			}
			if (when === false) continue;
			if (this._isQuestionOptional(q)) {
				const answer = await this._getDefaultAnswer(q, answers);
				debug("%s: %j", q.name, answer);
				answers[q.name] = answer;
			} else {
				if (!process.stdin.isTTY) {
					const msg =
						"The stdin is not a terminal. No prompt is allowed. " +
						`(While resolving a required prompt ${JSON.stringify(
							q.name,
						)}.)`;
					this.log(chalk.red(msg));
					this.exit(new Error(msg));
					return;
				}
				// Only prompt for non-skipped questions
				const props = await super.prompt([q]);
				Object.assign(answers, props);
			}
		}
		return answers;
	}

	exit(reason) {
		// exit(false) should not exit
		if (reason === false) return;
		// exit(), exit(undefined), exit('') should exit
		if (!reason) reason = true;
		this.exitGeneration = reason;
	}

	/**
	 * Select pkgManager and install packages
	 * @param {String|Array} pkgs
	 * @param {Object} options
	 * @param {Object} spawnOpts
	 */
	pkgManagerInstall(pkgs, options = {}, spawnOpts) {
		const pm =
			this.config.get("packageManager") || this.options.packageManager;
		if (pm === "yarn") {
			return this.yarnInstall(pkgs, options.yarn, spawnOpts);
		}
		this.npmInstall(pkgs, options.npm, spawnOpts);
	}

	/**
	 * Run `[pkgManager] install` in the project
	 */
	install() {
		if (this.shouldExit()) return false;
		const opts = {
			npm: this.options.npmInstall,
			yarn: this.options.yarnInstall,
		};
		const spawnOpts = Object.assign({}, this.options.spawn, {
			cwd: this.destinationRoot(),
		});
		this.pkgManagerInstall(null, opts, spawnOpts);
	}

	/**
	 * Wrapper for mem-fs-editor.copyTpl() to ensure consistent options
	 *
	 * See https://github.com/SBoudrias/mem-fs-editor/blob/master/lib/actions/copy-tpl.js
	 *
	 * @param {string} from
	 * @param {string} to
	 * @param {object} context
	 * @param {object} templateOptions
	 * @param {object} copyOptions
	 */
	copyTemplatedFiles(
		from,
		to,
		context,
		templateOptions = {},
		copyOptions = {
			// See https://github.com/SBoudrias/mem-fs-editor/pull/147
			// Don't remove .ejs from the file name to keep backward-compatibility
			processDestinationPath: destPath => destPath,
			// See https://github.com/mrmlnc/fast-glob#options-1
			globOptions: {
				// Allow patterns to match filenames starting with a period (files &
				// directories), even if the pattern does not explicitly have a period
				// in that spot.
				dot: true,
				// Disable expansion of brace patterns ({a,b}, {1..3}).
				nobrace: true,
				// Disable extglob support (patterns like +(a|b)), so that extglobs
				// are regarded as literal characters. This flag allows us to support
				// Windows paths such as
				// `D:\Users\BKU\oliverkarst\AppData(Roaming)\npm\node_modules\@loopback\cli`
				noext: true,
			},
		},
	) {
		return this.fs.copyTpl(from, to, context, templateOptions, copyOptions);
	}

	_runNpmScript(projectDir, args) {
		return new Promise((resolve, reject) => {
			this.spawnCommand("npm", args, {
				// Disable stdout
				stdio: [process.stdin, "ignore", process.stderr],
				cwd: projectDir,
			}).on("close", code => {
				if (code === 0) resolve();
				else reject(new Error("npm exit code: " + code));
			});
		});
	}

	/**
	 * Check if the generator should exit
	 */
	shouldExit() {
		return !!this.exitGeneration;
	}

	async _runLintFix() {
		if (this.options.format) {
			const pkg = this.packageJson || {};
			if (pkg.scripts && pkg.scripts["lint:fix"]) {
				this.log(
					g.f("Running 'npm run lint:fix' to format the code..."),
				);
				await this._runNpmScript(this.destinationRoot(), [
					"run",
					"-s",
					"lint:fix",
				]);
			} else {
				this.log(
					chalk.red(
						g.f(
							"No 'lint:fix' script is configured in package.json.",
						),
					),
				);
			}
		}
	}

	/**
	 * Print out the exit reason if this generator is told to exit before it ends
	 */
	async end() {
		if (this.shouldExit()) {
			debug(this.exitGeneration);
			this.log(
				chalk.red(
					g.f("Generation is aborted: %s", this.exitGeneration),
				),
			);
			// Fail the process
			process.exitCode = 1;
			return;
		}
		await this._runLintFix();
	}

	// Check all files being generated to ensure they succeeded
	_isGenerationSuccessful() {
		const generationStatus = !!Object.entries(
			this.conflicter.generationStatus,
		).find(([key, val]) => {
			// If a file was modified, update the indexes and say stuff about it
			return val !== "skip" && val !== "identical";
		});
		debug(`Generation status: ${generationStatus}`);
		return generationStatus;
	}
};
