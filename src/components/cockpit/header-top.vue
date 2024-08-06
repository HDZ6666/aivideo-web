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
      <div class="backBtn">
        <dv-border-box-10>
          <div @click="back()" style="cursor: pointer;">后台管理</div>
        </dv-border-box-10>
      </div>
      <!-- <div class="openAlarm">
        <el-switch
          v-model="alarmNotify"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleAcceptAlarm"
        ></el-switch>
        <span class="openAlarmText">{{alarmNotify?'开启告警':'关闭告警'}}</span>
      </div> -->
    </div>
  </div>
</template>

  <script>
import { mixin } from "../../utils/mixin";
export default {
  name: "header-top",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    handleAcceptAlarm(value) {
      localStorage.setItem("alarmSwitchStatus", this.alarmNotify);
      this.$message.success(
        `${this.alarmNotify ? "开启" : "关闭"}订阅告警成功`
      );
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
