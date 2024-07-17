<template>
  <div class="deviceOnlineRate-container">
    <dv-decoration-7 style="width:100%;height:40px;">设备在线率</dv-decoration-7>
    <div class="ring-box">
      <dv-active-ring-chart class="dv-ring" :config="deviceOnlineData" />
    </div>
  </div>
</template>

<script>
export default {
  name: "deviceOnlineRate",
  props: [],
  data() {
    return {
      deviceOnlineData: {
        radius: "80%",
        activeRadius: "85%",
        color: ["#16bf9d", "#519fd7", "#e16379"],
        data: [
          {
            name: "设备总数",
            value: 78
          },
          {
            name: "在线数",
            value: 55
          },
          {
            name: "离线数",
            value: 120
          }
        ],
        digitalFlopStyle: {
          fontSize: 20
        }
      }
    };
  }
};
</script>

<style scoped>
.deviceOnlineRate-container {
  position: relative;
  width: 100%;
  flex: 1 1 189px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ring-box {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.dv-ring {
  width: 100%;
  height: 100%;
}
</style>
