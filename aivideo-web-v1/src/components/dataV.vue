<template>
  <!-- <div>11</div> -->
  <frame-page :frameSrc="frameUrl" fullScan></frame-page>
</template>

<script>
import FramePage from "./iframe/fullheight.vue";
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
      frameUrl: `${process.env.NODE_ENV === "development" ? "/datav/" : window.dataVUrl}`
    };
  },
  mounted() {
    // if (userService.getToken()) {
    //   this.frameUrl = `${
    //     window.iframeBaseUrl
    //   }/#/redirect?RedirectUrl=${encodeURIComponent(
    //     this.redirectUrl
    //   )}&token=${userService.getToken()}`;
    // }
  }
};
</script>

<style></style>
