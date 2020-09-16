const BaseGenerator = require("../../lib/generator/base-generator");
const path = require('path');
const fs = require("fs");
const _ = require("lodash");
const utils = require('../../lib/utils');
const cwd = process.cwd();
const basePath = path.resolve(cwd, "components");
const {kebabCase, camelCase} = _;


module.exports = class ComponentGenerator extends BaseGenerator {
    constructor(args, opts){
        super(args, opts);
    }

    _setupGenerator() {
        this.componentInfo = {};

        this.argument("name", {
            type: String,
            required: false,
            description: utils.g.f("Name for the component")
        });

        this.option("title", {
            type: String,
            required: false,
            description: utils.g.f("Title for the component")
        });

        super._setupGenerator();
    }

    setOptions() {
        super.setOptions();
        if (this.shouldExit()) return false;
        const {name, title} = this.options;
        this.componentInfo = {
            ...this.componentInfo,
            name, title
        }
    }

    // _getComponentsJson() {
    //     let result = require(`${basePath}/components.json`);
    //     if(!Array.isArray(result)){
    //         result = [];
    //     }
    //     return result;
    // }

    getComponentsConfig() {
        let components = require(`${basePath}/components.json`);
        if(!Array.isArray(components)){
            components = [];
        }
        const nameList = components.map(item => {
            return item.name;
        });

        this.componentInfo = {
            components,
            nameList,
            ...this.componentInfo
        }
    }

    // _getComponentsName(){
    //     const componentsJson = this._getComponentsJson();
    //     return componentsJson.map(item => {
    //         return item.name;
    //     });
    // }

    _checkComponentExist(name) {
        let isExist = false;
        isExist = this.componentInfo.nameList.includes(name);
        return isExist;
    }

    _checkComponentFolderExist(name) {
        return fs.existsSync(`${basePath}/${name}`)
    }

    promptComponentInfo() {
        if (this.shouldExit()) return false;
        const prompts = [
            {
                type: "input",
                name: "name",
                message: utils.g.f("Component name:"),
                default: this.options.name,
                // when: this.componentInfo.name == null,
                validate: name => {
                    if(name.trim() === ""){
                        return "Invalid component name";
                    }
                    if(this._checkComponentExist(name)){
                        return "The component name already exists";
                    }
                    if(this._checkComponentFolderExist(name)) {
                        return "The component folder already exists";
                    }
                    return true;
                },

            },
            {
                type: "input",
                name: "title",
                message: utils.g.f("Component title:"),
                when: this.componentInfo.title == null,
                default: this.options.name,
                validate: name => {
                    if(name.trim() === ""){
                        return "Invalid component title";
                    }
                    return true;
                }
            }
        ]

        return this.prompt(prompts).then(props => {
            props.name = kebabCase(props.name);
            Object.assign(this.componentInfo, props);
        });
    }

    _rewriteEntries (nameList) {
        const entryPath = `${basePath}/entry.js`;
        if(fs.existsSync(entryPath)){
            fs.unlinkSync(entryPath);
        }

        this.copyTemplatedFiles(
            this.templatePath('../../add/templates/entry.js'),
            entryPath,
            {
              nameList,
            },
        );
    }

    scaffold() {
        if (this.shouldExit()) return false;
        const {name, title, components} = this.componentInfo;
        this.destinationRoot("components/" + name);

        this.copyTemplatedFiles(
            this.templatePath('../../add/templates/source/**/*'),
            this.destinationPath(''),
            {
              component: this.componentInfo,
            },
        );

        this.fs.move(
            this.destinationPath(`template.vue`),
            this.destinationPath(`${name}.vue`),
        );

        components.push({
            title,
            name,
            "path": `/${name}`,
            "fullPath": `./components/${name}/index.js`
        });
        fs.writeFileSync(
            `${basePath}/components.json`,
            JSON.stringify(components, null, "\t")
        )

        // generator entry file
        const nameList = components.map(item => {
            return {
                name: item.name,
                camelName: camelCase(item.name)
            }
        });
        this._rewriteEntries(nameList);
    }   

    async end() {
        if (this.shouldExit()) {
            await super.end();
            return;
        }

        // User Output
        this.log();
        this.log(
            utils.g.f(
                'component %s was created successful',
                this.componentInfo.name
            ),
        );
    }
}
