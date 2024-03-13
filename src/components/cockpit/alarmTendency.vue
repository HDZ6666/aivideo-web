<template>
  <div class="alarmTendency-container">
    <dv-decoration-7 class="module-title">告警趋势</dv-decoration-7>
    <div class="alarmTendency-line">
      <ve-line
        width="350px"
        height="180px"
        ref="ConsoleNet1"
        :data="alarmTendencyData"
        :extend="alarmTendencyData.extend"
        :legend-visible="false"
      ></ve-line>
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmTendency",
  props: ["alarmTendencyData"]
};
</script>

<style>
.alarmTendency-container {
  width: 100%;
  height: 230px;
}
.alarmTendency-line {
  width: 100%;
  /* height: calc(100% - 50px); */
  /* flex: 1; */
}
</style>
