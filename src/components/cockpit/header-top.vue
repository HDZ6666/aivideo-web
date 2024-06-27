<template>
  <div id="top-header">
    <dv-decoration-8 class="header-left-decoration" :color="['#180e64', '#180e64']" />
    <dv-decoration-5 class="header-center-decoration" :color="['#180e64', '#180e64']" />
    <dv-decoration-8
      class="header-right-decoration"
      :reverse="true"
      :color="['#180e64', '#180e64']"
    />
    <div class="center-title">监控驾驶舱</div>
    <div class="right-btn">
      <div class="backBtn" @click="back()">
        <dv-border-box-10>后台管理</dv-border-box-10>
      </div>
    </div>
  </div>
</template>

  <script>
export default {
  name: "header-top",
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.push("/");
    }
  }
};
</script>

  <style>
#top-header {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-center-decoration {
  width: 40%;
  height: 60px;
  margin-top: 30px;
}

.header-left-decoration,
.header-right-decoration {
  width: 25%;
  height: 60px;
}

.center-title {
  position: absolute;
  font-size: 30px;
  font-weight: bold;
  left: 50%;
  top: 15px;
  transform: translateX(-50%);
}
.right-btn {
  position: absolute;
  right: 90px;
  top: 50px;
  width: 250px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.backBtn {
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}

.openAlarm {
  display: inline-flex;
  align-items: center;
}
.openAlarmText {
  font-size: 17px;
  font-weight: bold;
  margin-left: 5px;
}
</style>
