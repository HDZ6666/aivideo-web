<template>
  <div class="alarmCount-container">
    <dv-decoration-7 class="module-title">告警统计</dv-decoration-7>
    <ve-histogram
      :extend="alarmCountData.extend"
      :data="alarmCountData"
      width="100%"
      height="220px"
    ></ve-histogram>
  </div>
</template>

<script>
export default {
  name: "alarmCount",
  props: ["alarmCountData"]
};
</script>

<style>
</style>