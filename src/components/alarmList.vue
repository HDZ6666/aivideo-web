<template>
  <!-- <div>11</div> -->
  <frame-page :frameSrc="frameUrl"></frame-page>
</template>

<script>
import FramePage from "./iframe/index.vue";
import userService from "./service/UserService";
export default {
  name: "alarmList",
  components: {
    FramePage
  },
  data() {
    return {
      // frameUrl: "http://183.239.58.24:106666//#/iframe/alarmList"
      // frameUrl: "http://192.168.1.106:8066/#/iframe/alarmList",
      frameUrl: `${window.iframeBaseUrl}/#/ai/alarm`
    };
  },
  mounted() {
    if (userService.getToken()) {
      this.frameUrl = `${
        window.iframeBaseUrl
      }/#/ai/alarm?token=${userService.getToken()}`;
    }
  }
};
</script>

<style></style>
