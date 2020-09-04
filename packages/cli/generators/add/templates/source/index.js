import Component from "./<%= component.name %>.vue";

Component.install = function(Vue){
    Vue.component(Component.name, Component);
}

export default Component;