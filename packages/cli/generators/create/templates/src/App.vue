<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less">
* {
	margin: 0;
	padding: 0;
}

body {
	font-family: PingFang SC, Verdana, Helvetica Neue, Microsoft Yahei,
		Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;
}

a {
	color: inherit;
	text-decoration: none;
}

a:hover {
	color: inherit;
	text-decoration: underline;
}

ul,
li,
ol {
	list-style: none;
}
</style>