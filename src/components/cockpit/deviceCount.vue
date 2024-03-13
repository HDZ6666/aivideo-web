<template>
  <div class="deviceCount-container">
    <dv-decoration-7 class="module-title">设备统计</dv-decoration-7>
    <dv-scroll-ranking-board :config="deviceCountData" class="count-content" />
  </div>
</template>

<script>
export default {
  name: "deviceCount",
  props: ["deviceCountData"]
};
</script>

<style scoped>
.deviceCount-container {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
}
.count-content {
  width: 100%;
  flex: 1;
}
</style>
