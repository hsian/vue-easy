
import Components from "../../components/components.json";

export default  {
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
                name: "基础组件",
                list: Components
                // {
                //     "title": "按钮",
                //     "name": "ve-button",
                //     "path": "./components/button/index.js"
                // }

				// "list": [
				// 	{
				// 		"path": "/icon",
				// 		"title": "图标 icon"
				// 	}
				// ]
			}
		]
	}
}
