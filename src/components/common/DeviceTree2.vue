<template>
  <div id="DeviceTree" style="width: 100%;height: 100%; background-color: #FFFFFF; overflow: auto">
    <el-container>
      <el-header>设备列表</el-header>
      <el-main style="background-color: #ffffff;">
        <div class="device-tree-main-box">
          <el-tree
            ref="gdTree"
            :data="deviceGroupList"
            :props="defaultProps"
            :load="loadNode"
            lazy
            @node-click="handleNodeClick"
            node-key="id"
            style="min-width: 100%; display:inline-block !important;"
          >
            <!-- <span class="custom-tree-node" slot-scope="{ node, data }" style="width: 100%">

              <span>
                <i
                  v-if="node.data.hasGPS && node.data.online"
                  style="color: #9d9d9d"
                  class="device-online iconfont icon-dizhi"
                ></i>
                <i
                  v-if="node.data.hasGPS && !node.data.online"
                  style="color: #9d9d9d"
                  class="device-offline iconfont icon-dizhi"
                ></i>
              </span>
            </span>-->
          </el-tree>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import DeviceService from "../service/DeviceService.js";

export default {
  name: "DeviceTree",
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
      groupObj: {}
    };
  },
  props: ["device", "onlyCatalog", "clickEvent", "contextMenuEvent"],
  mounted() {
    // this.getDeviceGroup();
  },
  methods: {
    handleNodeClick(data, node, element) {
      if (data.type === "device") {
        this.clickEvent(data);
      }
      // console.log(data);
      // console.log(node);
      // console.log(element);
      // let deviceNode = this.$refs.gdTree.getNode(data.userData.deviceId);
      // if (typeof this.clickEvent == "function") {
      //   this.clickEvent(
      //     deviceNode.data.userData,
      //     data.userData,
      //     data.type === 2
      //   );
      // }
    },
    handleContextMenu(event, data, node, element) {
      console.log("右键点击事件");
      let deviceNode = this.$refs.gdTree.getNode(data.userData.deviceId);
      if (typeof this.contextMenuEvent == "function") {
        this.contextMenuEvent(
          deviceNode.data.userData,
          event,
          data.userData,
          data.type === 2
        );
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
      // console.log(node);
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

      // if (node.level === 0) {
      //   this.$axios({
      //     method: "get",
      //     url: `/ai/api/device/group/cameraGroupList`
      //   })
      //     .then(res => {
      //       if (res.data.code === 0) {
      //         const deviceGroupList = this.tranformDeviceGroup(res.data.data);
      //         return resolve(deviceGroupList);
      //       }
      //     })
      //     .catch(error => {
      //       console.error(error);
      //     });
      // }
      // if (node.level === 1) {
      //   return resolve([]);
      // }
      // if(node.level === 2){
      //   return resolve([])
      // }
      // resolve([])

      // if (node.level === 0) {
      //   resolve([])
      // } else {
      // }
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
              console.log(type);
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
            deviceId: item.deviceId,
            type: type,
            online: item.basicData.status === 1,
            hasGPS: item.basicData.longitude * item.basicData.latitude !== 0,
            userData: item.basicData
          };
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
  destroyed() {
    // if (this.jessibuca) {
    //   this.jessibuca.destroy();
    // }
    // this.playing = false;
    // this.loaded = false;
    // this.performance = "";
  }
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
</style>
