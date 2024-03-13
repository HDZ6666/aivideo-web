<template>
  <div class="indicatorList-container">
    <div class="indicator-content" v-for="(i,index) in indicatorListData" :key="index">
      <dv-decoration-9 class="indicator-value" :color="['#59c4e6', '#59c4e6']">{{ i.value }}</dv-decoration-9>
      <div class="indicator-label">{{ i.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "indicatorList",
  props: ["indicatorListData"]
};
</script>

<style scoped>
.indicatorList-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  /* margin-bottom: 7px; */
}
.indicator-content {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.indicator-value {
  width: 80px;
  height: 80px;
}

.indicator-label {
  margin-top: 3px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}
</style>
