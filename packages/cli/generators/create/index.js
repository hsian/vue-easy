const ProjectGenerator = require("../../lib/generator/project-generator");
const utils = require("../../lib/utils");
const {g} = utils;

module.exports = class AppGenerator extends ProjectGenerator {
	constructor(args, opts) {
		super(args, opts);
	}

	_setupGenerator() {
		this.projectType = "application";
		return super._setupGenerator();
	}

	async setOptions() {
		await super.setOptions();
	}

	promptProjectName() {
		if (this.shouldExit()) return;
		return super.promptProjectName();
	}

	promptProjectDir() {
		if (this.shouldExit()) return;
		return super.promptProjectDir();
	}

	promptOptions() {
		if (this.shouldExit()) return;
		return super.promptOptions();
	}

	promptYarnInstall() {
		if (this.shouldExit()) return;
		return super.promptYarnInstall();
	}

	scaffold() {
		const result = super.scaffold();
		if (this.shouldExit()) return result;
	}

	install() {
		return super.install();
	}

	async end() {
		await super.end();
		if (this.shouldExit()) return;
		this.log();
		this.log(
			g.f(
				"Project %s was created in %s.",
				this.projectInfo.name,
				this.projectInfo.outdir,
			),
		);
		this.log();
		this.log(g.f("Next steps:"));
		this.log();
		this.log("$ cd " + this.projectInfo.outdir);
		this.log(`$ ${this.options.packageManager || "npm"} start`);
		this.log();
	}
};
