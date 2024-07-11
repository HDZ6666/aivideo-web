<template>
  <div class="container_bg" id="container">
    <div class="container">
      <header-top />
      <div class="container-content">
        <div class="content-left">
          <device-tree @deviceClick="handleDeviceClick"></device-tree>
          <!-- <device-count></device-count>
          <device-online-rate></device-online-rate>-->
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
        </div>-->
      </div>
    </div>
    <video-dialog ref="videoDialog"></video-dialog>
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
import videoDialog from "./cockpit/nationalVideoDialog.vue";
import alarmDialog from "./cockpit/alarmDialog.vue";

export default {
  name: "videoCockpit",
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
    videoDialog,
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
    // 代理
    // handleDeviceClick(data) {
    //   if (this.$refs.videoDialog) {
    //     const palyer = {
    //       name: data.name || data.channelName,
    //       videoUrl: data.streamInfo.ws_flv.url
    //     };
    //     this.$refs.videoDialog.open(palyer);
    //   }
    // },
    // 国标
    handleDeviceClick(data) {
      if (this.$refs.videoDialog) {
        // const palyer = {
        //   name: data.name || data.channelName,
        //   videoUrl: data.streamInfo.ws_flv.urlF
        // };
        this.$refs.videoDialog.open(data);
      }
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
  width: 350px;
  height: 100%;
}

.content-main {
  flex: 1;
  margin: 0 70px;
}

.content-right {
  width: 350px;
  height: 100%;
}
</style>
