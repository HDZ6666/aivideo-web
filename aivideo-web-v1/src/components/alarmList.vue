<template>
  <!-- <div>11</div> -->
  <frame-page :frameSrc="frameUrl"></frame-page>
</template>

<script>
import FramePage from "./iframe/index.vue";
export default {
  name: "alarmList",
  components: {
    FramePage
  },
  data() {
    return {
      // frameUrl: "http://183.239.58.24:106666//#/iframe/alarmList"
      // frameUrl: "http://192.168.1.106:8066/#/iframe/alarmList",
      frameUrl: `${window.iframeBaseUrl}/#/iframe/alarmList`
    };
  }
};
</script>

<style>
</style>
