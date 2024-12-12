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
        v-if="data.nodeType === 'device' && data.online"
        title="在线设备"
        class="device-online el-icon-video-camera-solid"
      ></span>
      <span
        v-if="data.nodeType === 'device' && !data.online "
        title="离线设备"
        class="device-offline el-icon-video-camera-solid"
      ></span>
    </span>
  </el-tree>
</template>

<script>
export default {
  name: "DeviceTree",
  props: {
    isScreen: Boolean,
    clickEvent: Function
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "isLeaf"
      },
      deviceLoad: false,
      deviceGroupList: [],
      groupObj: {}
    };
  },
  mounted() {},
  methods: {
    handleNodeClick(data, node, element) {
      if (data.nodeType === "device") {
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
          // 请求设备
          this.getDeviceTree(node.data.id, resolve);
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
    getDeviceTree: function(categoryId, resolve) {
      this.$axios({
        method: "get",
        url: `/ai/api/device/queryManager/list`,
        params: {
          page: 1,
          pageSize: 9999,
          categoryId: categoryId
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = res.data.data.list.map(item => {
              return {
                name: item.name,
                nodeType: "device",
                id: item.streamKey,
                isLeaf: true,
                online: true,
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
    reset: function() {
      this.$forceUpdate();
    }
  },
  destroyed() {}
};
</script>

<style>
.screen-device-tree {
  background: transparent;
  color: #f1f4f7;
  font-weight: 400;
}
.screen-device-tree .el-tree-node__expand-icon {
  color: #fff;
}
.screen-device-tree .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}
.screen-device-tree .el-tree-node__content:hover {
  background-color: rgba(31, 51, 162, 0.6);
}

.screen-device-tree .el-tree-node:focus > .el-tree-node__content {
  background-color: rgba(31, 51, 162, 0.6);
}

.screen-device-tree .el-tree-node__content {
  min-height: 26px;
  height: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  overflow: hidden;
  flex-wrap: nowrap;
  flex-direction: row;
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
