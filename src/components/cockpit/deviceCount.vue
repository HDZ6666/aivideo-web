<template>
  <div class="deviceCount-container">
    <dv-decoration-7 style="width:100%;height:40px;">设备统计</dv-decoration-7>
    <dv-scroll-ranking-board :config="deviceCountData" class="count-content" />
  </div>
</template>

<script>
export default {
  name: "deviceCount",
  props: [],
  data() {
    return {
      deviceCountData: {
        rowNum: 4,
        data: []
      }
    };
  },
  mounted() {
    this.deviceCountData.data = new Array(20).fill(1).map((item, index) => {
      return {
        name: `分组${index}`,
        value: 2 * index + 10
      };
    });
  }
};
</script>

<style scoped>
.deviceCount-container {
  position: relative;
  width: 100%;
  flex: 1 1 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.count-content {
  width: 100%;
  flex: 1;
}
</style>
