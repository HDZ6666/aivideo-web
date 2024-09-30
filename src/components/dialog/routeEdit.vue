<template>
  <div id="routeEdit" v-loading="isLoging">
    <el-dialog
      title="路线编辑"
      width="80%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="margin-top: 1rem;margin-right: 100px;">
        <el-form ref="form" :rules="rules" :model="form" label-width="200px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="路线编号" prop="deviceId">
                <el-input v-if="isEdit" v-model="form.deviceId" disabled></el-input>
                <el-input v-if="!isEdit" v-model="form.deviceId" clearable></el-input>
              </el-form-item>

              <el-form-item label="路线名称" prop="name">
                <el-input v-model="form.name" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div style="float: right;">
              <el-button type="primary" @click="onSubmit">确认</el-button>
              <el-button @click="close">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MediaServer from "../service/MediaServer";
import TreeSelect from "../common/TreeSelect.vue";
export default {
  name: "routeEdit",
  props: {},
  components: {
    TreeSelect
  },
  computed: {},
  mounted() {
    this.getGroupList();
  },
  data() {
    return {
      listChangeCallback: null,
      showDialog: false,
      isLoging: false,
      hostNames: [],
      mediaServerList: [], // 滅体节点列表
      mediaServerObj: new MediaServer(),
      form: {},
      isEdit: false,
      rules: {
        deviceId: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ]
      },
      groupList: [],
      treeProps: {
        children: "children",
        label: "group_name",
        value: "id"
      }
    };
  },
  methods: {
    getGroupList() {
      this.$axios({
        method: "get",
        url: `/ai/api/device/group/cameraGroupList`
      })
        .then(res => {
          if (res.data.code === 0) {
            this.groupList = res.data.data;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    openDialog: function(row, callback) {
      this.showDialog = true;
      this.isEdit = false;
      if (row) {
        this.isEdit = true;
      }
      this.form = {};
      this.listChangeCallback = callback;
      if (row != null) {
        this.form = row;
        this.form.groupId = !row.groupId ? "" : +row.groupId;
      }
      this.getMediaServerList();
    },
    getMediaServerList: function() {
      let that = this;
      that.mediaServerObj.getOnlineMediaServerList(data => {
        that.mediaServerList = data.data;
      });
    },
    onSubmit: function() {
      this.form.subscribeCycleForCatalog =
        this.form.subscribeCycleForCatalog || 0;
      this.form.subscribeCycleForMobilePosition =
        this.form.subscribeCycleForMobilePosition || 0;
      this.form.mobilePositionSubmissionInterval =
        this.form.mobilePositionSubmissionInterval || 0;
      this.$axios({
        method: "post",
        url: `/api/device/query/device/${this.isEdit ? "update" : "add"}/`,
        params: this.form
      })
        .then(res => {
          if (res.data.code === 0) {
            this.listChangeCallback();
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(function(error) {});
    },
    close: function() {
      this.showDialog = false;
      this.$refs.form.resetFields();
    }
  }
};
</script>
