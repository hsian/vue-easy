<template>
  <div>
    <div class="main">
      <side-nav :navsData="navsData"></side-nav>
      <router-view :path="$route.path"></router-view>
    </div>
  </div>
</template>
<script>
  import navsData from "../routes/menus";

  export default {
    data(){
      return {
        navsData
      }
    }
  }
</script>
<style scoped>

</style>