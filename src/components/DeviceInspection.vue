<template>
  <div id="app" style="width: 100%">
    <div class="page-header">
      <div class="page-title">
        设备巡检列表
      </div>
      <div class="page-header-btn">
        <el-button
          icon="el-icon-plus"
          size="mini"
          type="primary"
          @click="handleBetchInspection"
          >批量巡检</el-button
        >
        <el-button
          icon="el-icon-magic-stick"
          size="mini"
          type="warning"
          @click="handleAllInspection"
          >一键巡检</el-button
        >
      </div>
    </div>
    <el-alert
      title="【一键巡检】功能默认巡检所有通道，如要巡检指定通道，可勾选指定通道后点击【批量巡检】，操作耗时请耐心等待!"
      type="error"
      :closable="false"
    >
    </el-alert>
    <!--用户列表-->
    <el-table
      :data="deviceList"
      row-key="deviceId"
      style="width: 100%;font-size: 12px;"
      :height="winHeight"
      header-row-class-name="table-header"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true"> </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        min-width="160"
      ></el-table-column>
      <el-table-column
        prop="deviceId"
        label="设备编号"
        min-width="200"
      ></el-table-column>
      <el-table-column label="状态" min-width="150">
        <template slot-scope="scope">
          <div
            slot="reference"
            class="name-wrapper"
            style="font-size: 30px;color: #c2c2c2;"
          >
            <i
              :class="[
                'el-icon-success',
                scope.row.status === 0 ? 'success' : ''
              ]"
            ></i>
            <i
              :class="[
                'el-icon-warning',
                scope.row.status === 1 ? 'warning' : ''
              ]"
            ></i>
            <i
              :class="['el-icon-error', scope.row.status === 2 ? 'error' : '']"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态信息" min-width="200" prop="statusDescribe">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最新巡检时间"
        min-width="160"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="medium"
            icon="el-icon-edit"
            type="text"
            @click="handleInspection([scope.row.deviceId])"
            >巡检</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
import editDeviceGroup from "../components/dialog/editDeviceGroup.vue";
import ChooseDeviceForGroup from "./dialog/chooseDeviceForGroup.vue";

export default {
  name: "userManager",
  components: {
    editDeviceGroup,
    ChooseDeviceForGroup
  },
  data() {
    return {
      deviceList: [], //设备列表
      winHeight: window.innerHeight - 230,
      currentPage: 1,
      count: 15,
      total: 0,
      getDeviceListLoading: false,
      multipleSelection: [],
      updateLooper: 0, //数据刷新轮训标志
    };
  },
  mounted() {
    this.initData();
    this.updateLooper = setInterval(this.initData, 2000);
  },
  destroyed() {
    clearTimeout(this.updateLooper);
  },
  methods: {
    initData: function() {
      this.getDeviceInspection();
    },
    currentChange: function(val) {
      this.currentPage = val;
      this.getDeviceInspection();
    },
    handleSizeChange: function(val) {
      this.count = val;
      this.getDeviceInspection();
    },
    getDeviceInspection: function() {
      this.getDeviceListLoading = true;
      this.$axios({
        method: "get",
        url: `/ai/api/device/inspection/devices`,
        params: {
          page: this.currentPage,
          count: this.count,
          groupId: 0
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            this.total = res.data.data.total;
            this.deviceList = res.data.data.list;
          }
          this.getDeviceListLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.getDeviceListLoading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBetchInspection() {
      if (this.multipleSelection.length < 2) {
        this.$message({
          type: "warning",
          message: "请选择至少两个设备!"
        });
        return;
      }
      this.$confirm(
        `此操作将在后台巡检【选中的${this.multipleSelection.length}个设备】,比较耗时,请确认?`,
        "批量巡检",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const list = this.multipleSelection.map(item => item.deviceId);
        this.handleInspection(list);
      });
    },
    handleAllInspection() {
      this.$confirm(
        `此操作将在后台巡检【所有设备】,比较耗时,请确认?`,
        "一键巡检",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.handleInspection();
      });
    },
    handleInspection(list = []) {
      const url =
        list.length > 0
          ? `/ai/api/device/inspection/devices/inspection/status`
          : "/ai/api/device/inspection/devices/inspection/all";
      this.$axios({
        method: "post",
        url: url,
        data: list
      })
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success('巡检任务已启动，请稍后查看结果!')
            // this.getDeviceInspection();
          }
          this.getDeviceListLoading = false;
        })
        .catch(error => {
          this.getDeviceListLoading = false;
        });
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

.success {
  color: #67c23a;
}
.warning {
  color: #e6a23c;
}
.error {
  color: #f56c6c;
}
</style>
