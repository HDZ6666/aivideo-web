<template>
  <div class="alarmCount-container">
    <dv-decoration-7 class="module-title">告警统计</dv-decoration-7>
    <div class="alarmCount-line">
      <ve-histogram
        :extend="alarmCountData.extend"
        :data="alarmCountData"
        width="350px"
        height="180px"
      ></ve-histogram>
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmCount",
  props: ["alarmCountData"]
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
</style>
