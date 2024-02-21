<template>
  <div class="alarmList-container">
    <dv-decoration-7 class="module-title">告警概览</dv-decoration-7>
    <dv-scroll-board :config="alarmListData" style="width:350px;height:200px" />
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
}
</style>>
