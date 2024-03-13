<template>
  <div class="deviceOnlineRate-container">
    <dv-decoration-7 class="module-title">设备在线率</dv-decoration-7>
    <div class="ring-box">
      <dv-active-ring-chart class="dv-ring" :config="deviceOnlineData" />
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
.deviceOnlineRate-container {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
}
.ring-box {
  position: relative;
  flex: 1;
  display: flex;
  /* width: 100%; */
  /* flex: 1; */
  /* width: 250px;
  height: 200px; */
  /* position: relative; */
}
.dv-ring {
  width: 100%;
  height: 100%;
  /* position: absolute;
  width: auto;
  max-height: 100%;
  right: 10%; */
}
</style>
