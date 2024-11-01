<template>
  <frame-page :frameSrc="frameUrl"></frame-page>
</template>

<script>
import FramePage from "../iframe/fullheight.vue";
export default {
  name: "datavV2",
  components: {
    FramePage
  },
  mounted() {
    window.dispatchEvent(new CustomEvent("enterFullScreen" ))
  },
  unmounted() {
    // console.log("unmounted");
    window.dispatchEvent(new CustomEvent("exitFullScreen" ))
  },
  data() {
    return {
      frameUrl: `/datav/`
    };
  }
};
</script>

<style>
</style>
