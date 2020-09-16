import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import Components from "../components";
import routes from "./routes/route-config";

import SideNav from "./components/SideNav";
import DocsLayout from "./layout/DocsLayout";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Components);

Vue.component("side-nav", SideNav);
Vue.component("docs-layout", DocsLayout);

const router = new VueRouter({
	mode: "hash",
	base: __dirname,
	routes,
});

new Vue({
	render: h => h(App),
	router,
}).$mount("#app");
