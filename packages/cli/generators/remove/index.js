const BaseGenerator = require("../../lib/generator/base-generator");
const path = require('path');
const fs = require("fs");
const fsExtra = require('fs-extra')
const utils = require('../../lib/utils');
const basePath = path.resolve( process.cwd(), "components");


module.exports = class RemoveGenerator extends BaseGenerator {
    constructor(args, opts){
        super(args, opts);
    }

    _setupGenerator () {
        this.componentInfo = {};

        this.argument("name", {
            type: String,
            required: false,
            description: utils.g.f("Name of the component to remove")
        });

        super._setupGenerator();
    }

    setOptions () {
        super.setOptions();
        if (this.shouldExit()) return false;
        this.componentInfo.name = this.options.name;
    }

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

    _checkComponentExist(name) {
        let isExist = false;
        isExist = this.componentInfo.nameList.includes(name);
        return isExist;
    }

    _checkComponentFolderExist(name) {
        return fs.existsSync(`${basePath}/${name}`)
    }

    promptComponentInfo(){
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
                    if(!this._checkComponentExist(name)){
                        console.log(name)
                        return "The component does not exist";
                    }
                    if(!this._checkComponentFolderExist(name)) {
                        return "The component folder does not exists";
                    }

                    this.componentInfo.name = name;
                    return true;
                },
            } 
        ]

        return this.prompt(prompts).then(props => {
            Object.assign(this.componentInfo, props);
        });
    }

    promptConfirm(){
        const prompts = [
            {
                type: "confirm",
                name: "confirm",
                message: utils.g.f(`Are you sure remove component: ${this.componentInfo.name}`),
                default: true
            } 
        ]

        return this.prompt(prompts).then(props => {
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
        const {name, confirm, nameList} = this.componentInfo;
        this.destinationRoot("components");

        if (confirm === false) return;
        
        // remove folder
        fsExtra.remove(`${basePath}/${name}`);

        // rewrite component.json
        const {components} =  this.componentInfo;
        const remain = components.filter(item => {
            return name != item.name;
        })
        fs.writeFileSync(
            `${basePath}/components.json`,
            JSON.stringify(remain, null, "\t")
        )

        // rewrite entry.js
        nameList.splice(nameList.indexOf(name), 1);
        this._rewriteEntries(nameList);
    }

    async end () {
        if (this.shouldExit()) {
            await super.end();
            return;
        }
        const {confirm, name} = this.componentInfo;

        // User Output
        this.log();
        this.log(
            utils.g.f(
                confirm ? 
                `component %s was remove successful` : 
                `component %s was remove cancel`,
                name
            ),
        );
    }
}