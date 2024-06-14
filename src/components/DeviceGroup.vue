<template>
  <div id="app" style="width: 100%">
    <div class="page-header">
      <div class="page-title">分组列表</div>
      <div class="page-header-btn">
        <el-button
          icon="el-icon-plus"
          size="mini"
          style="margin-right: 1rem;"
          type="primary"
          @click="addUser"
        >添加分组</el-button>
      </div>
    </div>
    <!--用户列表-->
    <el-table
      :data="deviceGroupList"
      row-key="id"
      style="width: 100%;font-size: 12px;"
      :height="winHeight"
      header-row-class-name="table-header"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="group_name" label="分组名称" />
      <el-table-column prop="level" label="等级" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === 1 ? 'primary' : 'danger'"
            disable-transitions
          >{{scope.row.state === 1 ? '启用' : '禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isScreen" label="大屏模板">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isScreen === 1 ? 'primary' : 'danger'"
            disable-transitions
          >{{scope.row.isScreen === 1 ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button
            v-if="scope.row.level > 0"
            size="medium"
            icon="el-icon-edit"
            type="text"
            @click="chooseDevice(scope.row)"
          >添加设备</el-button>
          <el-divider direction="vertical"></el-divider>-->
          <el-button size="medium" icon="el-icon-edit" type="text" @click="edit(scope.row)">修改分组</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            size="medium"
            icon="el-icon-delete"
            type="text"
            @click="deleteUser(scope.row)"
            style="color: #f56c6c"
          >删除分组</el-button>
        </template>
      </el-table-column>
    </el-table>
    <changePasswordForAdmin ref="changePasswordForAdmin"></changePasswordForAdmin>
    <changePushKey ref="changePushKey"></changePushKey>
    <editDeviceGroup ref="editDeviceGroup" @getDeviceGroup="getDeviceGroup"></editDeviceGroup>
    <ChooseDeviceForGroup ref="ChooseDeviceForGroup" @getDeviceGroup="getDeviceGroup"></ChooseDeviceForGroup>
    <el-pagination
      style="float: right"
      @size-change="handleSizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-size="count"
      :page-sizes="[15, 25, 35, 50]"
      layout="total, sizes, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import changePasswordForAdmin from "./dialog/changePasswordForAdmin.vue";
import changePushKey from "./dialog/changePushKey.vue";
import editDeviceGroup from "../components/dialog/editDeviceGroup.vue";
import ChooseDeviceForGroup from "./dialog/chooseDeviceForGroup.vue";

export default {
  name: "userManager",
  components: {
    changePasswordForAdmin,
    changePushKey,
    editDeviceGroup,
    ChooseDeviceForGroup
  },
  data() {
    return {
      deviceGroupList: [], //设备列表
      winHeight: window.innerHeight - 200,
      currentPage: 1,
      count: 15,
      total: 0,
      getDeviceGroupLoading: false
    };
  },
  mounted() {
    this.initData();
    // this.updateLooper = setInterval(this.initData, 10000);
  },
  destroyed() {
    this.$destroy("videojs");
    clearTimeout(this.updateLooper);
  },
  methods: {
    initData: function() {
      this.getDeviceGroup();
    },
    currentChange: function(val) {
      this.currentPage = val;
      this.getDeviceGroup();
    },
    handleSizeChange: function(val) {
      this.count = val;
      this.getDeviceGroup();
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
            this.total = res.data.data.length || 0;
          }
          this.getDeviceGroupLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.getDeviceGroupLoading = false;
        });
    },
    edit: function(row) {
      const options = this.deviceGroupList.filter(item => item.level === 0);
      this.$refs.editDeviceGroup.openDialog("edit", options, row);
    },
    deleteUser: function(row) {
      let msg = "确定删除此分组？";
      this.$confirm(msg, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning"
      })
        .then(() => {
          this.getDeviceGroupLoading = true;
          this.$axios({
            method: "delete",
            url: `/ai/api/device/group/deleteGroup?id=${row.id}`
          })
            .then(res => {
              this.getDeviceGroupLoading = false;
              this.getDeviceGroup();
            })
            .catch(error => {
              this.getDeviceGroupLoading = false;
            });
        })
        .catch(() => {});
    },

    addUser: function() {
      const options = this.deviceGroupList.filter(item => item.level === 0);
      this.$refs.editDeviceGroup.openDialog("add", options, null);
    },
    chooseDevice(row) {
      this.$refs.ChooseDeviceForGroup.openDialog(row);
    }
  }
};
</script>
<style>
.videoList {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.video-item {
  position: relative;
  width: 15rem;
  height: 10rem;
  margin-right: 1rem;
  background-color: #000000;
}

.video-item-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}

.video-item-img:after {
  content: "";
  display: inline-block;
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 3rem;
  height: 3rem;
  background-image: url("../assets/loading.png");
  background-size: cover;
  background-color: #000000;
}

.video-item-title {
  position: absolute;
  bottom: 0;
  color: #000000;
  background-color: #ffffff;
  line-height: 1.5rem;
  padding: 0.3rem;
  width: 14.4rem;
}
</style>
