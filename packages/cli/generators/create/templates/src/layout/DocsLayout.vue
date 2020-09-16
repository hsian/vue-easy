<template>
	<div class="docs-layout">
		<slot></slot>
	</div>
</template>
<script>
export default {
	created: function () {
		//path = this.path;
	},
	mounted: function () {},
	props: {
		path: String,
	},
};
</script>
<style lang="less">
@import "highlight.js/styles/monokai-sublime.css";
@import "../assets/code.less";
.docs-layout > div:first-child {
	flex: 1;
	padding: 0 20px;
	box-sizing: border-box;
}

.docs-layout {
	max-width: 750px;
	margin: 0 auto;
	.live-wrapper {
		border-top: 1px #eee solid;
		padding: 30px 0;

		pre {
			margin-top: 0;
		}
	}
}
</style>