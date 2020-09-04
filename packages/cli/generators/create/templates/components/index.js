import components from "./components.json";

const install = function(Vue){
    components.forEach(item => {
        const path = "../" + item.path;
        // const component = () => import(path);
        const component = Promise.resolve(require(`path`).default)
        const name = component.name || item.name;
        Vue.component(name, component);
    })
}

export default { install }