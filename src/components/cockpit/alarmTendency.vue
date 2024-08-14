<template>
  <div class="alarmTendency-container">
    <dv-decoration-7 style="width:100%;height:40px;">告警趋势</dv-decoration-7>
    <div class="alarmTendency-line">
      <ve-line
        judgeWidth
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
import moment from "moment";
export default {
  name: "alarmTendency",
  props: [],
  data() {
    return {
      alarmTendencyData: {
        columns: ["date", "alarmCount"],
        rows: []
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
  },
  mounted() {
    this.alarmTendencyData.rows = new Array(7).fill(0).map((item, index) => {
      return {
        date: moment()
          .subtract(index, "days")
          .format("M/D"),
        alarmCount: 0
      };
    });
    this.getAlarmList();
  },
  methods: {
    getAlarmList() {
      this.$axios({
        method: "get",
        url: `/ai/api/alarm/alarmTrendListSevenDay`
      }).then(res => {
        if (res.data.code === 0) {
          const list = res.data.data;
          if (list.length === 0) return;
          const _list = list.map(item => {
            return {
              date: moment(item.alarmDate).format("M/D"),
              alarmCount: item.alarmNum
            };
          });
          this.$set(this.alarmTendencyData, "rows", _list);
          console.log(this.alarmTendencyData);
        }
      });
    }
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
.custom-class {
  /* width:200px !important;
  height: 100% !important; */
}
</style>
