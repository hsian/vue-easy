<template>
	<div class="container">
		<div class="header">
      <div class="logo">Vue 组件文档</div>
      <div class="links"></div>
    </div>

    <div class="content">
      <div class="aside col-3">
        <side-nav :navsData="navsData"></side-nav>
      </div>
      <div class="main">
        <router-view :path="$route.path"></router-view>
      </div>
    </div>
	</div>
</template>
<script>
import navsData from "../routes/menus";

export default {
	data() {
		return {
			navsData,
		};
	},
};
</script>
<style scoped lang="less">
.container {
  position: relative;
  height: 100vh;

  .header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    border-bottom: 1px #eee solid;

    .logo{
      font-size: 20px;
      font-weight: 600;
    }
  }

  .content {
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    display: flex;

    .aside {
      width: 280px;
      height: 100%;
      flex-shrink: 0;
      overflow-y: auto;
      border-right: 1px #eee solid;
    }

    .main {
      flex: 1;
      height: 100%;
      overflow-y: auto;
    }
  }
}

@media only screen and (max-width: 960px) {
  .aside {
    width: 250px!important;
  }
}

@media only screen and (max-width: 768px) {
  .aside {
    width: 200px!important;
  }
}

@media only screen and (max-width: 540px) {
  .aside {
    display: none;
  }
}
</style>