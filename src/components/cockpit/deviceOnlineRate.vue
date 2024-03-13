<template>
  <div class="deviceOnlineRate-container">
    <dv-decoration-7 class="module-title">设备在线率</dv-decoration-7>
    <div class="ring-box">
      <!-- <dv-water-level-pond :config="config" class="dv-ring" /> -->
      <!-- <dv-charts class="dv-ring" :option="option" /> -->
      <dv-active-ring-chart class="dv-ring" :config="deviceOnlineData" />
    </div>
  </div>
</template>

<script>
export default {
  name: "deviceOnlineRate",
  props: ["deviceOnlineData"],
  data() {
    return {
      option: {
        series: [
          {
            type: "pie",
            data: [
              { name: "在线", value: 93 },
              { name: "离线", value: 32 },
              { name: "总数", value: 52 }
            ],
            radius: ["45%", "65%"],
            insideLabel: {
              show: false
            },
            outsideLabel: {
              labelLineEndLength: 10,
              formatter: "{percent}%\n{name}",
              style: {
                fontSize: 14,
                fill: "#fff"
              }
            }
          }
        ],
        color: ["#00baff", "#3de7c9", "#fff", "#ffc530", "#469f4b"]
      }
    };
  }
};
</script>

<style scoped>
.deviceOnlineRate-container {
  width: 100%;
  height: 30%;
  /* display: flex; */
  /* flex-direction: column; */
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
  width: 160px;
  height: 160px;
  /* position: absolute;
  width: auto;
  max-height: 100%;
  right: 10%; */
}
</style>
