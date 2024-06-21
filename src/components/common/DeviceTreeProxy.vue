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
    style="min-width: 100%; display:inline-block !important;"
  ></el-tree>
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
        this.clickEvent(data);
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
                online: false,
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
</style>
