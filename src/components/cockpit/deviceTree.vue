<template>
  <div class="device-box">
    <div class="device-content">
      <CockputDeviceTree :clickEvent="clickEvent"></CockputDeviceTree>
      <!-- <el-tree
        id="deviceList"
        :data="deviceList"
        :highlight-current="false"
        @node-click="handleDeviceClick"
      ></el-tree>-->
    </div>
    <dv-border-box-11 title="设备列表" class="device-border"></dv-border-box-11>
  </div>
</template>

<script>
import DeviceTree from "../common/DeviceTree3.vue";
export default {
  name: "deviceTree",
  props: ["deviceList"],
  components: {
    CockputDeviceTree: DeviceTree
  },
  methods: {
    // handleDeviceClick(data) {
    //   this.$emit("deviceClick", data);
    // },
    clickEvent: function(device) {
      if (device.userData && device.userData.streamInfo) {
        this.$emit("deviceClick", data);
      }
    }
  }
};
</script>

<style>
.device-box {
  position: relative;
  height: 500px;
  padding: 60px 10px 10px;
  box-sizing: border-box;
}

.device-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.device-border {
  position: absolute !important;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: -1;
}

/* 下拉树的样式改变 */
#deviceList {
  background: transparent;
  color: #000;
  font-weight: bold;
  font-size: 20px;
}
#deviceList .el-tree-node__expand-icon {
  color: #000;
}

#deviceList .el-tree-node__content:hover {
  background-color: transparent;
}
#deviceList .el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
}
</style>
