<template>
  <el-tree
    id="deviceList"
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
  props: ["clickEvent"],
  mounted() {
    // this.getDeviceGroup();
  },
  methods: {
    handleNodeClick(data, node, element) {
      if (data.type === "device") {
        this.clickEvent(data);
      }
    },
    getDeviceGroup: function() {
      this.$axios({
        method: "get",
        url: `/ai/api/device/group/cameraGroupList`
      })
        .then(res => {
          if (res.data.code === 0) {
            this.deviceGroupList = this.tranformDeviceGroup(
              res.data.data,
              "group"
            );
            this.deviceLoad = true;
            console.log(this.deviceGroupList);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    loadNode: function(node, resolve) {
      if (node.level < 2) {
        this.$axios({
          method: "get",
          url: `/ai/api/device/group/cameraGroupList`,
          params: {
            parentId: node.level === 0 ? 0 : node.data.id
          }
        })
          .then(res => {
            if (res.data.code === 0) {
              const list = this.tranformDeviceGroup(res.data.data, node.level);
              resolve(list);
            }
          })
          .catch(error => {
            resolve([]);
          });
      } else {
        this.$axios({
          method: "get",
          url: `/ai/api/device/queryManager/list`,
          params: {
            page: 1,
            pageSize: 9999,
            categoryId: node.data.id
          }
        })
          .then(res => {
            if (res.data.code === 0) {
              const list = this.tranformDeviceGroup(
                res.data.data.list,
                node.level
              );
              resolve(list);
            }
          })
          .catch(error => {
            resolve([]);
            console.error(error);
          });
      }
    },

    tranformDeviceGroup(groupList, level) {
      if (groupList.length === 0) {
        return [];
      }
      if (level < 2) {
        return groupList.map(item => {
          return {
            name: item.group_name,
            type: "group",
            id: item.id,
            isLeaf: false,
            online: false,
            // children: this.tranformDeviceGroup(item.children),
            userData: item
          };
        });
      }
      return groupList.map(item => {
        return {
          name: item.name,
          type: "device",
          id: item.streamKey,
          isLeaf: true,
          online: false,
          // children: this.tranformDeviceGroup(item.children),
          userData: item
        };
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
.device-tree-main-box {
  text-align: left;
}
.device-online {
  color: #252525;
}
.device-offline {
  color: #727272;
}

#deviceList {
  background: transparent;
  color: #f1f4f7;
  font-weight: 400;
}
#deviceList .el-tree-node__expand-icon {
  color: #fff;
}
#deviceList .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}

#deviceList .el-tree-node__content:hover {
  /* background-color: transparent; */
}
#deviceList .el-tree-node:focus > .el-tree-node__content {
  /* background-color: transparent; */
  background-color: rgba(31, 51, 162, 0.6);
}
/* #deviceList .is-current > .el-tree-node__content {
  background-color: rgba(31, 51, 162, 0.6);
} */
</style>
