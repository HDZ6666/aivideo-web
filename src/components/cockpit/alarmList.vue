<template>
  <div class="alarmList-container">
    <dv-decoration-7 class="module-title">告警概览</dv-decoration-7>
    <dv-scroll-board :config="alarmListData" class="alarm-list" />
  </div>
</template>

<script>
export default {
  name: "alarmList",
  props: ["alarmListData"]
};
</script>

<style scoped>
.alarmList-container {
  height: 36%;
  display: flex;
  flex-direction: column;
}
.alarm-list {
  flex: 1;
  width: 100%;
  /* height: 100%; */
}
</style>>
