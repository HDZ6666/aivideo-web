<template>
  <frame-page :frameSrc="frameUrl"></frame-page>
</template>

<script>
import FramePage from "../iframe/index.vue";
export default {
  name: "datavV2",
  components: {
    FramePage
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
