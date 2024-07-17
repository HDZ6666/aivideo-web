<template>
  <div class="alarmList-container">
    <dv-decoration-7 style="width:100%;height:40px;">告警概览</dv-decoration-7>
    <dv-scroll-board :config="alarmListData" class="alarm-list" />
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
        rowNum: 5,
        data: [
          ["2024/1/19 10:20:33", "区域入侵", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"],
          ["2024/1/19 10:20:33", "区域入侵", "未处理"],
          ["2024/1/19 10:20:33", "周界闯入", "未处理"],
          ["2024/1/19 10:20:33", "周界闯入", "未处理"],
          ["2024/1/19 10:20:33", "区域入侵", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"]
        ],
        columnWidth: [180, 120, 80],
        align: ["center"]
      }
    };
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
