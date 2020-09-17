# vue-easy

帮助你快速创建自己的vue组件库，提供了快速开发、测试、打包和生成文档的组件环境。

## 安装

```shell
npm install -g vue-easy
```

## 使用

**创建组件库项目**

```shell
vue-easy create app-component
```

```shell
cd app-component
```

**添加组件**

```shell
vue-easy add my-input
```

> ”my-input“ 为组件名，组件创建好后尽量不要手动修改名字，如果需要废弃，可以通过下面移除组件命令进行移除

**移除组件**

```shell
vue-easy remove my-input
```

**打包组件库**

```shell
npm run dist
```

> 组件打包完毕后可以提交到 npm  等包管理器。

## 文档

**查看开发文档**

```shell
npm run dev
```

**打包开发文档**

```shell
npm run build
```



## 引用

项目如何引入组件？在组件库中提供了多种方式，以组件库为`app-component`为例。

**1.直接引入**

````vue
<template>
  <div id="app">
    <myInput/>
  </div>
</template>

<script>
import myInput from "app-component/lib/components/my-input"

export default {
  components: {
    myInput,
  }
}
</script>
````

**2.babel插件按需加载（推荐）**

```
npm install babel-plugin-import
```

`babel.config.js`

```
module.exports = {
  plugins: [
    [
      "import",
      {
        "libraryName": "app-component",
        style: (name) => {
          return 'app-component/lib/styles/' + name.split("\/").pop() + '.css'
        },
      }
    ]
  ]
}

```

> 注意替换app-component。

项目中使用

```vue
<template>
  <div id="app">
    <myInput/>
  </div>
</template>

<script>
import myInput from "app-component";

export default {
  components: {
    myInput,
  }
}
</script>
```

##  说明

主要目录说明: 

```js
- app-component
	- components // 主要开发目录
		- example-button // 组件例子
		- component.json // 自动生成的配置文件（自动生成）
		- entry.js 		 // 自动生成的入口配置（自动生成）
		- index.js		 // 全局组件注册文件（无需编辑）
		- index.md		 // 开发文当的准备说明文档
	- ...
```

















