<template>
  <!-- <div class="iframe-page"> -->
  <div id="app" :style="getWrapStyle" v-loading="loading">
    <iframe
      :src="frameSrc"
      class="iframe"
      ref="frameRef"
      frameborder="no"
      :border="0"
      marginwidth="0"
      marginheight="0"
      allowtransparency="yes"
      @load="hideLoading"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "FramePage",
  props: {
    frameSrc: {
      type: String,
      default: ""
    },
    fullScan: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getWrapStyle() {
      return {
        width: "100%",
        height: this.fullScan ? "100%" : `${window.innerHeight - 100}px`,
        fontSize: 0
      };
    }
  },
  data() {
    return {
      loading: true
    };
  },
  methods: {
    calcHeight() {
      const iframe = this.$refs.frameRef;
      if (!iframe) {
        return;
      }
      iframe.style.height = `${window.innerHeight - 100}px`;
    },
    hideLoading() {
      this.loading = false;
      if (!this.fullScan) {
        this.calcHeight();
      }
    }
  }
};
</script>

<style>
.iframe-page {
  width: 100%;
  height: 100%;
}
.iframe {
  width: 100%;
  height: 100%;
}
</style>
