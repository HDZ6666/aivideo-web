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
  width: 100%;
  height: 225px;
}
.alarm-list {
  width: 100%;
  height: 175px;
}
</style>>
