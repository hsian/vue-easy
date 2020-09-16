import Component from "./example-button.vue";

Component.install = function (Vue) {
	Vue.component(Component.name, Component);
};

export default Component;
