"use strict";

const BaseGenerator = require("./base-generator");
const chalk = require("chalk");
const path = require("path");
const utils = require("../utils");
const cliVersion = require("../../package.json").version;
const {g} = utils;

module.exports = class ProjectGenerator extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts);
		this.buildOptions = [];
	}

	_setupGenerator() {
		this.argument("name", {
			type: String,
			required: false,
			description: g.f("Project name for the %s", this.projectType),
		});

		this.option("description", {
			type: String,
			description: g.f("Description for the %s", this.projectType),
		});

		this.option("outdir", {
			type: String,
			description: g.f(
				"Project root directory for the %s",
				this.projectType,
			),
		});

		super._setupGenerator();
	}

	async setOptions() {
		await super.setOptions();
		if (this.shouldExit()) return false;
		if (this.options.name) {
			const msg = utils.validate(this.options.name);
			if (typeof msg === "string") {
				this.exit(msg);
				return false;
			}
		}

		this.projectInfo = {
			projectType: this.projectType,
			dependencies: utils.getDependencies(),
		};

		this.projectOptions = ["name", "description", "outdir"].concat(
			this.buildOptions || [],
		);

		this.projectOptions.forEach(n => {
			if (typeof n === "object") {
				n = n.name;
			}

			if (this.options[n]) {
				this.projectInfo[n] = this.options[n];
			}
		});
	}

	promptProjectName() {
		if (this.shouldExit()) return false;
		const prompts = [
			{
				type: "input",
				name: "name",
				message: g.f("Project name:"),
				when: this.projectInfo.name == null,
				default:
					this.options.name ||
					utils.toFileName(path.basename(process.cwd())),
				validate: utils.validate,
			},
			{
				type: "input",
				name: "description",
				message: g.f("Project description:"),
				when: this.projectInfo.description == null,
				default: this.options.name || this.appname,
			},
		];

		return this.prompt(prompts).then(props => {
			Object.assign(this.projectInfo, props);
		});
	}

	promptProjectDir() {
		if (this.shouldExit()) return false;
		const prompts = [
			{
				type: "input",
				name: "outdir",
				message: g.f("Project root directory:"),
				when:
					this.projectInfo.outdir == null ||
					// prompts if option was set to a directory that already exists
					utils.validateNotExisting(this.projectInfo.outdir) !== true,
				validate: utils.validateNotExisting,
				default: utils.toFileName(this.projectInfo.name),
			},
		];

		return this.prompt(prompts).then(props => {
			Object.assign(this.projectInfo, props);
		});
	}

	promptOptions() {
		if (this.shouldExit()) return false;
		const choices = [];
		this.buildOptions.forEach(f => {
			if (this.options[f.name] == null) {
				const name = g.f("Enable %s", f.name);
				choices.push({
					name: `${name}: ${chalk.gray(f.description)}`,
					key: f.name,
					short: `Enable ${f.name}`,
					checked: true,
				});
			} else {
				this.projectInfo[f.name] = this.options[f.name];
			}
		});
		const prompts = [
			{
				name: "settings",
				message: g.f("Select features to enable in the project"),
				type: "checkbox",
				choices: choices,
				// Skip if all features are enabled by cli options
				when: choices.length > 0,
			},
		];
		return this.prompt(prompts).then(props => {
			const settings = props.settings || choices.map(c => c.short);
			const features = choices.map(c => {
				return {
					key: c.key,
					value:
						settings.indexOf(c.name) !== -1 ||
						settings.indexOf(c.short) !== -1,
				};
			});
			features.forEach(f => (this.projectInfo[f.key] = f.value));
		});
	}

	promptYarnInstall() {
		if (this.shouldExit()) return false;
		const prompts = [
			{
				type: "confirm",
				name: "yarn",
				message: g.f(
					"Yarn is available. Do you prefer to use it by default?",
				),
				when: !this.options.packageManager && utils.isYarnAvailable(),
				default: false,
			},
		];

		return this.prompt(prompts).then(props => {
			if (props.yarn) {
				this.options.packageManager = "yarn";
			}
		});
	}

	scaffold() {
		if (this.shouldExit()) return false;

		this.destinationRoot(this.projectInfo.outdir);

		// Store information for cli operation in .yo.rc.json
		this.config.set("version", cliVersion);
		this.config.set("packageManager", this.options.packageManager || "npm");

		// Copy project type specific files from ./templates
		this.copyTemplatedFiles(
			this.templatePath("**/*"),
			this.destinationPath(""),
			{
				project: this.projectInfo,
			},
		);

		// generate .yo-rc.json configure file
		this.config.save();
	}
};
