<template>
  <div class="device-group-container">
    <div class="device-group-title">
      <span>设备分组</span>
      <el-button size="mini" type="primary" @click="addGroup">全部</el-button>
    </div>
    <el-divider></el-divider>
    <el-tree
      ref="groupTree"
      node-key="id"
      default-expand-all
      :data="deviceGroupList"
      :props="treeProps"
      :expand-on-click-node="false"
      highlight-current
      @node-click="handleNodeClick"
    >
      <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="custom-tree-node-label">{{ node.label }}</span>
        <el-dropdown trigger="click" @command="handleMore($event)">
          <span class="custom-tree-node-more">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="data.level === 0" :command="{...data,action:'addGroup'}">新增分组</el-dropdown-item>
            <el-dropdown-item :command="{...data,action:'delGroup'}">删除分组</el-dropdown-item>
            <el-dropdown-item :command="{...data,action:'updateGroup'}">更新分组</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>-->
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "deviceGroupList",
  data() {
    return {
      getDeviceGroupLoading: false,
      deviceGroupList: [],
      treeProps: {
        children: "children",
        label: "group_name"
      }
    };
  },
  mounted() {
    this.getDeviceGroup();
  },
  methods: {
    addGroup: function() {
      this.$refs.groupTree.setCurrentKey(null);
      this.$emit("changeGroup", { id: 0 });
      // this.$router.push("/deviceGroup");
    },
    getDeviceGroup: function() {
      this.getDeviceGroupLoading = true;
      this.$axios({
        method: "get",
        url: `/ai/api/device/group/cameraGroupList`
      })
        .then(res => {
          if (res.data.code === 0) {
            this.deviceGroupList = res.data.data;
          }
          this.getDeviceGroupLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.getDeviceGroupLoading = false;
        });
    },
    getGroup: function() {
      return [...this.deviceGroupList];
    },
    getNode: function(id) {
      return this.$refs.deviceGroupTree.getNode(id);
    },
    handleNodeClick(data) {
      this.$emit("changeGroup", data);
    }
  }
};
</script>

<style scoped>
.device-group-container {
  width: 100%;
  overflow: hidden;
}
.device-group-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  flex-wrap: nowrap;
}
/* .custom-tree-node:hover .custom-tree-node-more {
  opacity: 1;
} */

.custom-tree-node-label {
  flex: 1;
  margin-right: 10px;
  white-space: normal;
  line-height: 14px;
  text-align: left;
  padding: 6px 0;
}
.custom-tree-node-more {
  flex: 0 0 14px;
  width: 14px;
  height: 14px;
  font-size: 10px;
  line-height: 21px;
}
.el-tree-node__content {
  height: auto;
}
</style>
