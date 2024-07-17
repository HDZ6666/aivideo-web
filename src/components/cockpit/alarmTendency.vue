<template>
  <div class="alarmTendency-container">
    <dv-decoration-7 style="width:100%;height:40px;">告警趋势</dv-decoration-7>
    <div class="alarmTendency-line">
      <ve-line
        width="100%"
        height="100%"
        ref="ConsoleNet1"
        :data="alarmTendencyData"
        :extend="alarmTendencyExtend"
        :legend-visible="false"
      ></ve-line>
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmTendency",
  props: [],
  data() {
    return {
      alarmTendencyData: {
        columns: ["date", "告警"],
        rows: [
          { date: "1-01", 告警: 10 },
          { date: "1-02", 告警: 20 },
          { date: "1-03", 告警: 30 },
          { date: "1-04", 告警: 50 },
          { date: "1-05", 告警: 100 },
          { date: "1-06", 告警: 10 }
        ]
      },
      alarmTendencyExtend: {
        grid: { x: 10, y: 10, x2: 15, y2: 10 },
        yAxis: {
          axisLabel: {
            color: "#fff"
          }
        },
        xAxis: {
          axisLabel: {
            color: "#fff"
          }
        }
      }
    };
  }
};
</script>

<style>
.alarmTendency-container {
  position: relative;
  width: 100%;
  flex: 1 1 230px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.alarmTendency-line {
  width: 100%;
  flex: 1;
}
</style>
