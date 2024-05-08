<template>
  <div class="alarmCount-container">
    <dv-decoration-7 class="module-title aa">告警统计</dv-decoration-7>
    <div class="alarmCount-line">
      <ve-histogram :extend="alarmCountExtend" :data="alarmCountData" width="350px" height="180px"></ve-histogram>
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmCount",
  props: ["alarmCountData", "alarmCountExtend"]
};
</script>

<style>
.alarmCount-container {
  width: 100%;
  height: 230px;
}
.alarmCount-line {
  width: 100%;
}
.aa{
  width: 120%;
}
</style>
