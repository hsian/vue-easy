import Components from "../../components/components.json";

export default {
	// home: {
	// 	name: "首页",
	// 	path: "/",
	// 	component: "home"
	// },
	component: {
		name: "组件",
		path: "/",
		component: "component",
		groups: [
			{
				name: "准备",
				list: [
					{
					    "title": "文档说明",
					    "name": "",
					    "path": "/statement"
					}
				]
			},
			{
				name: "组件列表",
				list: Components,
			},
		],
	},
};
