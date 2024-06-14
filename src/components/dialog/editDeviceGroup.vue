<template>
  <div id="editdeviceGroup" v-loading="isLoging">
    <el-dialog
      :title="type==='add'?'添加分组':'修改分组'"
      width="40%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="margin-right: 20px;">
        <el-form
          ref="editGroupForm"
          :model="editForm"
          :rules="rules"
          status-icon
          label-width="80px"
        >
          <el-form-item label="分组名称" prop="group_name">
            <el-input v-model="editForm.groupName" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="editForm.state" placeholder="请选择" style="width: 100%">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="父级分组" prop="parentId">
            <el-select v-model="editForm.parentId" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in options"
                :label="item.group_name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="大屏模板" prop="isScreen">
            <el-select v-model="editForm.isScreen" placeholder="请选择" style="width: 100%">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div style="float: right;">
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="close">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "editDeviceGroup",
  computed: {},
  data() {
    return {
      value: "",
      type: "add",
      options: [],
      rules: {
        groupName: [{ required: true, trigger: "blur" }]
      },
      editForm: {
        groupName: null,
        state: 1,
        parentId: null,
        isScreen: 0
      },
      // groupObject: null,
      loading: false,
      listChangeCallback: null,
      showDialog: false,
      isLoging: false
    };
  },
  methods: {
    openDialog: function(type, options, groupObject) {
      this.type = type;
      this.options = options;
      // this.groupObject = groupObject;
      if (type === "edit") {
        this.editForm = {
          id: groupObject.id,
          groupName: groupObject.group_name,
          state: groupObject.state,
          parentId: groupObject.parent_id === 0 ? null : groupObject.parent_id
        };
      }
      this.showDialog = true;
    },
    onSubmit: function() {
      this.$refs.editGroupForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.type === "add" ? this.addGroup() : this.editGroup();
      });
      // console.log(this.$refs.editGroupForm.validate());
    },
    addGroup: function() {
      this.$axios({
        method: "post",
        url: "/ai/api/device/group/addGroup",
        data: this.editForm
      })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              showClose: true,
              message: "添加成功",
              type: "success"
            });
            this.$emit("getDeviceGroup");
            this.showDialog = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    editGroup: function() {
      this.$axios({
        method: "post",
        url: "/ai/api/device/group/updateDeviceGroup",
        data: this.editForm
      })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              showClose: true,
              message: "修改",
              type: "success"
            });
            this.$emit("getDeviceGroup");
            this.showDialog = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    close: function() {
      this.showDialog = false;
      this.type = null;
      this.options = null;
      this.editForm = {
        groupName: null,
        state: 1,
        parentId: null,
        isScreen: 0
      };
    }
  }
};
</script>
