<template>
	<div class="side-nav">
		<ul class="nav-wrap">
			<li class="nav-item" v-for="(nav, i) in navsData.component.groups" :key="i">
				<h4>{{nav.name}}</h4>
				<ul class="subnav-wrap">
					<li class="subnav-item" v-for="(subnav, j) in nav.list" :key="j">
						<router-link :to="navsData.component.path + subnav.path.slice(1)" 
						exact 
						v-text="subnav.name != subnav.title ? 
						`${subnav.name} ${subnav.title}` : 
						subnav.title"></router-link>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: {
		navsData: Object,
	},
};
</script>
<style scoped lang="less">
.side-nav {
	padding: 40px 0;
	line-height: 2;

	h4{
		font-size: 16px;
		padding: 0 30px;
	}

	.subnav-item {
		a{
			font-size: 14px;
			display: block;
			padding: 0 30px 0 50px;

		}

		/deep/ .router-link-exact-active {
			color: #3eaf7c;
			font-weight: 600;
			border-left: 5px #3eaf7c solid;
		}
	}
}
</style>