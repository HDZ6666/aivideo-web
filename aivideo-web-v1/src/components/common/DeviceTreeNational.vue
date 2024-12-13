<template>
  <el-tree
    :class="isScreen?'screen-device-tree':'device-tree'"
    ref="gdTree"
    :data="deviceGroupList"
    :props="defaultProps"
    :load="loadNode"
    lazy
    @node-click="handleNodeClick"
    node-key="id"
    style="width: 100%; display:inline-block !important;"
  >
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <div class="tree-node-label">{{ node.label }}</div>
      <span
        v-if="data.nodeType === 'channel' && data.online"
        title="在线设备"
        class="device-online el-icon-video-camera-solid"
      ></span>
      <span
        v-if="data.nodeType === 'channel' && !data.online "
        title="离线设备"
        class="device-offline el-icon-video-camera-solid"
      ></span>
    </span>
  </el-tree>
</template>

<script>
import DeviceService from "../service/DeviceService.js";
export default {
  name: "DeviceTree",
  props: {
    isScreen: Boolean,
    clickEvent: Function
  },
  data() {
    return {
      deviceService: new DeviceService(),
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "isLeaf"
      },
      deviceLoad: false,
      deviceGroupList: [],
      groupObj: {},
      onlyCatalog: false
    };
  },
  mounted() {},
  methods: {
    handleNodeClick(data, node, element) {
      if (data.nodeType === "channel") {
        if (!data.online) {
          this.$message.error("设备离线!不允许点播");
        } else {
          this.clickEvent(data);
        }
      }
    },
    loadNode: function(node, resolve) {
      // 初始化
      if (node.level === 0) {
        this.getGroupTree(node.level, resolve);
      }
      if (node.level > 0) {
        // 类型是分组并且有子分组
        if (node.data.nodeType === "group" && node.data.hasChildren) {
          this.getGroupTree(node.data.id, resolve);
        }
        // 类型是分组并且没有子分组
        if (node.data.nodeType === "group" && !node.data.hasChildren) {
          // 请求NVR
          this.getDeviceTree(node.data.id, resolve);
        }
        // 类型是设备
        if (node.data.nodeType === "device") {
          // 请求通道
          this.getChannelTree(node.data.id, resolve);
        }
      }
    },
    getGroupTree: function(parentId, resolve) {
      this.$axios({
        method: "get",
        url: `/ai/api/device/group/cameraGroupList`,
        params: {
          parentId: parentId
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = res.data.data.map(item => {
              return {
                name: item.group_name,
                nodeType: "group", //类型
                id: item.id,
                isLeaf: false,
                online: false,
                hasChildren: item.children && item.children.length > 0, //是否有子节点
                userData: item
              };
            });
            if (parentId === 0) {
              const all = {
                name: "全部设备",
                nodeType: "group", //类型
                id: 0,
                isLeaf: false,
                online: false,
                hasChildren: false,
                userData: null
              };
              list.unshift(all); // 把全部添加到数组第一
            }
            resolve(list);
          } else {
            resolve([]);
          }
        })
        .catch(error => {
          resolve([]);
        });
    },
    getDeviceTree: function(groupId, resolve) {
      this.$axios({
        method: "get",
        url: `/api/device/query/devices`,
        params: {
          page: 1,
          count: 9999,
          groupId: groupId
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = res.data.data.list.map(item => {
              return {
                name: item.name || item.deviceId,
                isLeaf: false,
                id: item.deviceId,
                nodeType: "device",
                type: 1,
                online: item.onLine,
                userData: item
              };
            });
            resolve(list);
          } else {
            resolve([]);
          }
        })
        .catch(error => {
          resolve([]);
        });
    },
    getChannelTree: function(deviceId, resolve) {
      this.$axios({
        method: "get",
        url: `/api/device/query/tree/${deviceId}`,
        params: {
          page: 1,
          count: 9999,
          parentId: deviceId,
          onlyCatalog: this.onlyCatalog
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            this.channelDataHandler(res.data.data.list, resolve);
          } else {
            resolve([]);
          }
        })
        .catch(error => {
          resolve([]);
        });
    },
    channelDataHandler: function(data, resolve) {
      if (data.length > 0) {
        let nodeList = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          let type = 3;
          if (item.id.length <= 10) {
            type = 2;
          } else {
            if (item.id.length > 14) {
              let channelType = item.id.substring(10, 13);
              console.log("channelType: " + channelType);
              if (channelType === "215" || channelType === "216") {
                type = 2;
              }
              if (item.basicData.ptztype === 1) {
                // 1-球机;2-半球;3-固定枪机;4-遥控枪机
                type = 4;
              } else if (item.basicData.ptztype === 2) {
                type = 5;
              } else if (
                item.basicData.ptztype === 3 ||
                item.basicData.ptztype === 4
              ) {
                type = 6;
              }
            } else {
              if (
                item.basicData.subCount > 0 ||
                item.basicData.parental === 1
              ) {
                type = 2;
              }
            }
          }
          let node = {
            name: item.name || item.basicData.channelId,
            isLeaf: type !== 2,
            id: item.id,
            nodeType: "channel",
            deviceId: item.deviceId,
            type: type,
            online: item.basicData.status,
            hasGPS: item.basicData.longitude * item.basicData.latitude !== 0,
            userData: item.basicData
          };
          console.log(node);
          nodeList.push(node);
        }
        resolve(nodeList);
      } else {
        resolve([]);
      }
    },
    reset: function() {
      this.$forceUpdate();
    }
  },
  destroyed() {}
};
</script>

<style>
.screen-device-tree {
  background: transparent !important;
  color: #f1f4f7 !important;
  font-weight: 400;
}
.screen-device-tree .el-tree-node__expand-icon {
  color: #fff;
}
.screen-device-tree .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
.screen-device-tree .el-tree-node__content {
  min-height: 26px;
  height: auto;
}
.screen-device-tree .el-tree-node__content:hover {
  background-color: rgba(31, 51, 162, 0.6);
}

.screen-device-tree .el-tree-node:focus > .el-tree-node__content {
  background-color: rgba(31, 51, 162, 0.6);
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.device-online {
  font-size: 18px;
  color: #59c4e6;
}
.device-offline {
  font-size: 18px;
  color: #c6ced8;
}

.tree-node-label {
  width: 90%;
  white-space: normal;
  word-wrap: break-word; /* 旧版浏览器支持 */
  overflow-wrap: break-word; /* 标准属性 */
}
</style>
