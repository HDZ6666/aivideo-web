<template>
  <!-- <div>11</div> -->
  <frame-page :frameSrc="frameUrl"></frame-page>
</template>

<script>
import FramePage from "./iframe/index.vue";
import userService from "./service/UserService";
export default {
  name: "fence",
  components: {
    FramePage
  },
  data() {
    return {
      // frameUrl: "http://183.239.58.24:10666//#/iframe/fence"
      // frameUrl: "http://192.168.1.106:8066/#/iframe/fence"
      frameUrl: `${window.iframeBaseUrl}/`,
      redirectUrl: "/ai/setting"
    };
  },
  mounted() {
    if (userService.getToken()) {
      this.frameUrl = `${
        window.iframeBaseUrl
      }/#/redirect?RedirectUrl=${encodeURIComponent(
        this.redirectUrl
      )}&token=${userService.getToken()}`;
    }
  }
};
</script>

<style></style>
