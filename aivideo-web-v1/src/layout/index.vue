<template>
  <el-container style="height: 100%">
    <el-header style="height: auto;" :style="{padding: 0}">
      <ui-header v-if="!fullscreen"/>
    </el-header>
    <el-main :style="{padding: 0}">
      <el-container style="height: 100%">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import uiHeader from "./UiHeader.vue";

export default {
  name: "index",
  components: {
    uiHeader
  },
  data() {
    return {
      fullscreen: false
    }
  },
  mounted() {
    window.addEventListener("toggleFullScreen", this.toggleFullScreen)
  },
  unmounted() {
    window.removeEventListener("toggleFullScreen", this.toggleFullScreen)
  },
  methods:{
    toggleFullScreen() {
      console.log("toggleFullScreen", new Date());
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>
<style>
body{
  font-family: sans-serif;
}
/*定义标题栏*/
.page-header {
  background-color: #FFFFFF;
  margin-bottom: 1rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-weight: bold;
  text-align: left;
}

.page-header-btn {
  text-align: right;
}
</style>
<style scoped>
.fade-enter {
  visibility: hidden;
  opacity: 0;
}

.fade-leave-to {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-to,
.fade-leave {
  visibility: visible;
  opacity: 1;
}
</style>
