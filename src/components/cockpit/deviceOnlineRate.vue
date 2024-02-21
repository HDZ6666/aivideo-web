<template>
  <div class="deviceOnlineRate-container">
    <dv-decoration-7 class="module-title">设备在线率</dv-decoration-7>
    <div class="ring-box">
      <dv-active-ring-chart class="ring" :config="deviceOnlineData" />
    </div>
  </div>
</template>

<script>
export default {
  name: "deviceOnlineRate",
  props: ["deviceOnlineData"]
};
</script>

<style scoped>
.ring-box {
  width: 250px;
  height: 200px;
  position: relative;
}
.ring {
  width: 200px;
  height: 200px;
  position: absolute;
}
</style>