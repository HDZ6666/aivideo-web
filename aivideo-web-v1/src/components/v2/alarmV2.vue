<template>
  <frame-page :frameSrc="frameUrl"></frame-page>
</template>

<script>
import FramePage from "../iframe/index.vue";
export default {
  name: "alarmV2",
  components: {
    FramePage
  },
  data() {
    return {
      frameUrl: `/pc/#/alarm`
    };
  }
};
</script>

<style>
</style>
