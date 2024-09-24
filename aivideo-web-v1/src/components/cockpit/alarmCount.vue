<template>
  <div class="alarmCount-container">
    <dv-decoration-7 style="width:100%;height:40px;">告警统计</dv-decoration-7>
    <div class="alarmCount-line">
      <ve-histogram :extend="alarmCountExtend" :data="alarmCountData" width="100%" height="100%"></ve-histogram>
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmCount",
  props: [],
  data() {
    return {
      alarmCountData: {
        columns: ["date", "提醒", "普通", "严重"],
        rows: [
          { date: "1-01", 提醒: 10, 普通: 20, 严重: 30 },
          { date: "1-02", 提醒: 20, 普通: 20, 严重: 30 },
          { date: "1-03", 提醒: 30, 普通: 20, 严重: 30 },
          { date: "1-04", 提醒: 10, 普通: 20, 严重: 30 },
          { date: "1-05", 提醒: 20, 普通: 20, 严重: 30 },
          { date: "1-06", 提醒: 30, 普通: 20, 严重: 30 }
        ]
      },
      alarmCountExtend: {
        grid: { x: 10, y: 40, x2: 15, y2: 10 },
        legend: {
          textStyle: {
            color: "#fff"
          }
        },
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
.alarmCount-container {
  position: relative;
  width: 100%;
  flex: 1 1 230px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.alarmCount-line {
  width: 100%;
  flex: 1;
}
</style>
