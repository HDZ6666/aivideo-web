<template>
  <div class="alarmTendency-container">
    <dv-decoration-7 class="module-title">告警趋势</dv-decoration-7>
    <div class="alarm">
      <ve-line
        ref="ConsoleNet1"
        :data="alarmTendencyData"
        :extend="alarmTendencyData.extend"
        width="100%"
        height="100%"
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
  display: flex;
  width: 100%;
  height: 32%;
  flex-direction: column;
}
.alarm {
  width: 100%;
  flex: 1;
}
</style>
