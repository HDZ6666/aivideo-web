<template>
  <div class="container_bg" id="container">
    <div class="container">
      <header-top />
      <div class="container-content">
        <div class="content-left">
          <device-tree @deviceClick="handleDeviceClick"></device-tree>
          <!-- <device-count></device-count> -->
          <!-- <device-online-rate></device-online-rate> -->
        </div>
        <div class="content-main">
          <indicator-list></indicator-list>
          <video-list></video-list>
          <!-- <dv-decoration-3 style="width:300px;height:50px;" />
          <alarm-carousel></alarm-carousel>-->
        </div>
        <!-- <div class="content-right">
          <alarm-list></alarm-list>
          <alarm-tendency></alarm-tendency>
          <alarm-count></alarm-count>
          <alarm-handle-count></alarm-handle-count>
        </div> -->
      </div>
    </div>
    <national-video-dialog ref="nationalVideoDialog" v-if="playerAction==='national'"></national-video-dialog>
    <proxy-video-dialog ref="proxyVideoDialog" v-if="playerAction==='proxy'"></proxy-video-dialog>
    <alarm-dialog ref="alarmDialog"></alarm-dialog>
  </div>
</template>

<script>
import "animate.css";
import autofit from "autofit.js";
import headerTop from "./cockpit/header-top.vue";
import deviceTree from "./cockpit/deviceTree.vue";
import deviceCount from "./cockpit/deviceCount.vue";
import deviceOnlineRate from "./cockpit/deviceOnlineRate.vue";
import indicatorList from "./cockpit/indicatorList.vue";
import videoList from "./cockpit/videoList.vue";
import alarmCarousel from "./cockpit/alarmCarousel.vue";
import alarmList from "./cockpit/alarmList.vue";
import alarmTendency from "./cockpit/alarmTendency.vue";
import alarmCount from "./cockpit/alarmCount.vue";
import alarmHandleCount from "./cockpit/alarmHandleCount.vue";
import nationalVideoDialog from "./cockpit/nationalVideoDialog.vue";
import proxyVideoDialog from "./cockpit/proxyVideoDialog.vue";
import alarmDialog from "./cockpit/alarmDialog.vue";

import { mixin } from "../utils/mixin";

export default {
  name: "videoCockpit",
  mixins: [mixin],
  components: {
    headerTop,
    deviceTree,
    deviceCount,
    deviceOnlineRate,
    indicatorList,
    videoList,
    alarmCarousel,
    alarmList,
    alarmTendency,
    alarmCount,
    alarmHandleCount,
    nationalVideoDialog,
    proxyVideoDialog,
    alarmDialog
  },
  data() {
    return {};
  },
  mounted() {
    autofit.init(
      {
        dh: 779,
        dw: 1440,
        el: "#container",
        resize: true
      },
      true
    );
  },
  destroyed() {},
  methods: {
    handleDeviceClick(data) {
      this.$refs[
        this.playerAction === "national"
          ? "nationalVideoDialog"
          : "proxyVideoDialog"
      ].open(data);
      // if (this.playerAction === "national" && this.$refs.nationalVideoDialog) {
      //   this.$refs.nationalVideoDialog.open(data);
      // }
      // if (this.playerAction === "proxy" && this.$refs.proxyVideoDialog) {
      //   this.$refs.proxyVideoDialog.open(data);
      // }
    }
  }
};
</script>

<style scoped>
.container_bg {
  width: 100%;
  height: 100%;
  background-image: url("/static/images/xinxidaxia.jpeg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  background-color: #475664;
  background-blend-mode: overlay;
}
.container {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: #fff;
  backdrop-filter: brightness(0.9);
}

#dv-full-screen-container {
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
}
.container-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0 10px 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.content-left {
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-main {
  flex: 1;
  margin: 0 20px;
  display: flex;
  flex-direction: column;
}

.content-right {
  width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
