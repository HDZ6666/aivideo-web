<template>
  <div id="chooseDeviceForGroup">
    <el-dialog
      title="选择设备"
      width="90%"
      top="2rem"
      custom-class="chooseDeviceForGroup"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-popover placement="top" width="160" v-model="popoverVisible">
          <p>确定要为该分组绑定这些设备吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>
          </div>
          <el-button slot="reference" type="primary">确 定</el-button>
        </el-popover>
        <!-- <el-button type="primary" @click="onSubmit">确 定</el-button> -->
      </span>
      <div class="" v-loading="isLoging">
        <el-row>
          <el-col :span="24" style="text-align: left;">
            <!--搜索-->
            <el-form :inline="true" :model="searchParams" size="mini">
              <el-form-item label="名称">
                <el-input v-model="searchParams.deviceName" placeholder="请输入名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="searchParams.deviceType" placeholder="请选择类型" clearable>
                  <el-option label="国标设备" value="2"></el-option>
                  <el-option label="代理设备" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchParams.deviceStaus" placeholder="请选择状态" clearable>
                  <el-option label="在线" value="1"></el-option>
                  <el-option label="离线" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchForm">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-alert
              show-icon
              :title="`当前分组【${group.group_name || ''}】，共选中：${groupDeviceList.length}个设备`"
              type="info"
              :closable="false"
            ></el-alert>
          </el-col>
          <el-col :span="24">
            <!--用户列表-->
            <el-table
              ref="deviceTable"
              :data="deviceList"
              row-key="id"
              style="width: 100%;font-size: 12px;"
              :height="winHeight"
              @select-all="handleSelectAll"
              @select="handleSelect"
              header-row-class-name="table-header"
            >
              <el-table-column
                type="selection"
                width="55"
                reserve-selection
                :selectable="selectableFunc"
              ></el-table-column>
              <el-table-column prop="deviceName" label="设备名称" min-width="150" fixed />
              <el-table-column prop="deviceType" label="类型" width="100">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{scope.row.deviceType}}</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" v-if="scope.row.deviceStaus === '1'">在线</el-tag>
                    <el-tag size="medium" type="info" v-else>离线</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="deviceId" label="设备编号" width="200" />
              <el-table-column prop="channelId" label="通道编号" width="200" />
              <el-table-column prop="stream" label="流ID" width="150" />
              <el-table-column label="流地址" min-width="400" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium" v-if="scope.row.url">
                      <i
                        class="cpoy-btn el-icon-document-copy"
                        title="点击拷贝"
                        v-clipboard="scope.row.url"
                        @success="$message({type:'success', message:'成功拷贝到粘贴板'})"
                      ></i>
                      {{scope.row.url}}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" style="text-align: left;">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="pagination.currentPage"
              :page-sizes="pagination.pageSizes"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "chooseDeviceForGroup",
  props: {},
  computed: {},
  created() {},
  data() {
    return {
      group: {},
      groupDeviceList: [],
      isLoging: true,
      showDialog: false,
      searchParams: {
        deviceName: "",
        deviceType: "",
        deviceStaus: ""
      },
      winHeight: window.innerHeight - 330,
      deviceList: [],
      selectDevices: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 50, 100, 500]
      },
      popoverVisible: false
    };
  },
  methods: {
    openDialog: function(group) {
      this.group = group;
      this.group.deviceList = [
        {
          groupId: 1,
          id: 0,
          date: "2016-05-02",
          deviceName: "代理0代理0代理0代理0代理0",
          deviceType: "直接代理",
          deviceStaus: "1",
          deviceId: "",
          channelId: "",
          stream: "10.16.133.6-14",
          url:
            "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
        },
        {
          groupId: 1,
          id: 1,
          date: "2016-05-02",
          deviceName: "代理1代理1代理1代理1代理1",
          deviceType: "直接代理",
          deviceStaus: "1",
          deviceId: "",
          channelId: "",
          stream: "10.16.133.6-14",
          url:
            "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
        },
        {
          groupId: 1,
          id: 11,
          date: "2016-05-02",
          deviceName: "代理1代理1代理1代理1代理1",
          deviceType: "直接代理",
          deviceStaus: "1",
          deviceId: "",
          channelId: "",
          stream: "10.16.133.6-14",
          url:
            "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
        }
      ];
      this.groupDeviceList = [...this.group.deviceList];
      console.log(this.group);
      this.showDialog = true;
      this.getDeviceList();
    },
    getDeviceList: function() {
      const params = {
        ...this.searchParams,
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      };
      // console.log(params);
      this.isLoging = true;
      this.$axios({
        method: "get",
        url: `/ai/api/device/group/cameraGroupList`,
        params: params
      })
        .then(res => {
          if (res.data.code === 0) {
            if (this.pagination.currentPage === 1) {
              this.deviceList = [
                {
                  groupId: 1,
                  id: 0,
                  date: "2016-05-02",
                  deviceName: "代理0代理0代理0代理0代理0",
                  deviceType: "直接代理",
                  deviceStaus: "1",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                },
                {
                  groupId: 1,
                  id: 1,
                  date: "2016-05-02",
                  deviceName: "代理1代理1代理1代理1代理1",
                  deviceType: "直接代理",
                  deviceStaus: "1",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                },
                {
                  groupId: 2,
                  id: 2,
                  date: "2016-05-02",
                  deviceName: "代理2代理2代理2代理12代理1",
                  deviceType: "直接代理",
                  deviceStaus: "2",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                },
                {
                  groupId: 2,
                  id: 3,
                  date: "2016-05-02",
                  deviceName: "国标1",
                  deviceType: "国标",
                  deviceStaus: "1",
                  deviceId: "44060610091322000010",
                  channelId: "44060610091182000010",
                  stream: "",
                  url: ""
                },
                {
                  groupId: "",
                  id: 4,
                  date: "2016-05-02",
                  deviceName: "国标2",
                  deviceType: "国标",
                  deviceStaus: "2",
                  deviceId: "44060610091322000010",
                  channelId: "44060610091182000010",
                  stream: "",
                  url: ""
                },
                {
                  groupId: "",
                  id: 5,
                  date: "2016-05-02",
                  deviceName: "代理1代理1代理1代理1代理1",
                  deviceType: "直接代理",
                  deviceStaus: "1",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                },
                {
                  groupId: "",
                  id: 6,
                  date: "2016-05-02",
                  deviceName: "代理2代理2代理2代理12代理1",
                  deviceType: "直接代理",
                  deviceStaus: "2",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                },
                {
                  groupId: "",
                  id: 7,
                  date: "2016-05-02",
                  deviceName: "国标1",
                  deviceType: "国标",
                  deviceStaus: "1",
                  deviceId: "44060610091322000010",
                  channelId: "44060610091182000010",
                  stream: "",
                  url: ""
                },
                {
                  groupId: "",
                  id: 8,
                  date: "2016-05-02",
                  deviceName: "国标2",
                  deviceType: "国标",
                  deviceStaus: "2",
                  deviceId: "44060610091322000010",
                  channelId: "44060610091182000010",
                  stream: "",
                  url: ""
                },
                {
                  groupId: "",
                  id: 9,
                  date: "2016-05-02",
                  deviceName: "代理1代理1代理1代理1代理1",
                  deviceType: "直接代理",
                  deviceStaus: "1",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                }
              ];
            } else {
              this.deviceList = [
                {
                  groupId: 1,
                  id: 11,
                  date: "2016-05-02",
                  deviceName: "代理1代理1代理1代理1代理1",
                  deviceType: "直接代理",
                  deviceStaus: "1",
                  deviceId: "",
                  channelId: "",
                  stream: "10.16.133.6-14",
                  url:
                    "rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0"
                }
              ];
            }
            this.pagination.total = 11;
            this.checked(); //每次更新了数据，触发这个函数即可。
          }
        })
        .finally(() => {
          this.isLoging = false;
        });
    },
    checked() {
      this.$nextTick(function() {
        this.deviceList.forEach(item => {
          if (this.groupDeviceList.some(device => device.id === item.id)) {
            this.$refs.deviceTable.toggleRowSelection(item, true);
          }
        });
      });
    },
    onSubmit: function() {
      this.popoverVisible = false;
      if (this.selectDevices.length <= 0) {
        this.$message.warning("请至少选择一台设备");
        return;
      }
      // this.isLoging = true;
    },
    close: function() {
      this.showDialog = false;
      this.reset();
    },
    searchForm() {
      this.pagination.currentPage = 1;
      this.getDeviceList();
    },
    handleSizeChange: function(val) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = val;
      this.getDeviceList();
    },
    handleCurrentChange: function(val) {
      this.pagination.currentPage = val;
      this.getDeviceList();
    },
    // 选择
    handleSelect(selection, row) {
      // 添加
      if (selection.some(device => device.id === row.id)) {
        this.groupDeviceList = [...this.groupDeviceList, ...[row]];
      } else {
        // 删除
        this.groupDeviceList = this.groupDeviceList.filter(
          device => device.id !== row.id
        );
      }
      this.selectDevices = selection;
    },
    handleSelectAll(selection) {
      if (selection.length > 0) {
        // 全选
        const list = selection.filter(
          item => !this.groupDeviceList.some(device => device.id === item.id)
        );
        this.groupDeviceList = [...this.groupDeviceList, ...list];
      } else {
        // 取消全选
        console.log("取消全选");
        this.groupDeviceList = this.groupDeviceList.filter(
          device => !this.deviceList.some(item => item.id === device.id)
        );
      }
      this.selectDevices = selection;
    },
    reset() {
      this.searchParams = {
        deviceName: "",
        deviceType: "",
        deviceStaus: ""
      };
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40]
      };
      this.selectDevices = [];
      this.deviceList = [];
    },
    selectableFunc(row, index) {
      return row.groupId !== "" && row.groupId !== this.group.id ? false : true;
    }
  }
};
</script>
<style>
.chooseDeviceForGroup .el-dialog__body {
  padding: 0 20px;
}
</style>
