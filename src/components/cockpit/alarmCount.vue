<template>
  <div class="alarmCount-container">
    <dv-decoration-7 class="module-title">告警统计</dv-decoration-7>
    <div class="alarmCount-line">
      <ve-histogram
        :extend="alarmCountData.extend"
        :data="alarmCountData"
        width="100%"
        height="100%"
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
  display: flex;
  width: 100%;
  height: 32%;
  flex-direction: column;
}
.alarmCount-line {
  width: 100%;
  flex: 1;
}
</style>
