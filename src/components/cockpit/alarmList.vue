<template>
  <div class="alarmList-container">
    <dv-decoration-7 style="width:100%;height:40px;">告警概览</dv-decoration-7>
    <div class="alarm-list">
      <dv-scroll-board :config="alarmListData" />
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmList",
  props: [],
  data() {
    return {
      alarmListData: {
        header: ["时间", "事件", "状态"],
        rowNum: 8,
        data: [],
        columnWidth: [180, 120, 80],
        align: ["center"]
      }
    };
  },
  mounted() {
    this.alarmListData.data = new Array(20).fill(0).map(item => {
      return [
        "--",
        "--",
        "--",
      ];
    });
    this.getAlarmList();
  },
  methods: {
    getAlarmList() {
      this.$axios({
        method: "get",
        url: `/ai/api/alarm/alarmCameraListAll`,
        params: {
          page: 1,
          pageSize: 20
        }
      }).then(res => {
        if (res.data.code === 0) {
          const { list } = res.data.data;
          const _list = list.map(item => {
            return [
              item.alarmTime || "--",
              item.modelname || "--",
              item.status === 1
                ? "已处理"
                : item.status === 2
                ? "误报"
                : "未处理",
            ];
          });
          this.alarmListData = {
            ...this.alarmListData,
            data:_list
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.alarmList-container {
  position: relative;
  width: 100%;
  flex: 1 1 240px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.alarm-list {
  width: 100%;
  flex: 1;
}
</style>>
