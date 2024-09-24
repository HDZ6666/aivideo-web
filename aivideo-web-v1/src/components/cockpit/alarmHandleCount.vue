<template>
  <div class="alarmHandleCount-container">
    <dv-decoration-7 style="width:100%;height:40px;">处理情况</dv-decoration-7>
    <div class="handle-box">
      <div class="handle-itme">
        <dv-percent-pond :config="handleconfig1" style="width:120px;height:50px;" />
        <span class="handle-label">今日未处理</span>
      </div>
      <div class="handle-itme">
        <dv-percent-pond :config="handleconfig2" style="width:120px;height:50px;" />
        <span class="handle-label">历史未处理</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "alarmHandleCount",
  data() {
    return {
      handleconfig1: {
        value: 66,
        borderWidth: 5,
        borderRadius: 10,
        borderGap: 5
      },
      handleconfig2: {
        value: 66,
        borderWidth: 5,
        borderRadius: 10,
        borderGap: 5
      }
    };
  }
};
</script>

<style scoped>
.alarmHandleCount-container{
  position: relative;
  width: 100%;
  flex: 0 0 120px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.handle-box {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.handle-itme {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}
.handle-label {
  line-height: 20px;
  margin-top: 5px;
}
</style>
