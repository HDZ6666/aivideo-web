<template>
  <div id="changeUser" v-loading="isLoging">
    <el-dialog
      title="修改用户信息"
      width="42%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="margin-right: 18px;">
        <el-form ref="userForm" :model="userForm" :rules="rules" label-width="86px">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="userForm.mobile" tyep="number" maxlength="11" clearable></el-input>
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
  name: "changeUser",
  props: {},
  computed: {},
  created() {},
  data() {
    var validatePhone = (rule, value, callback) => {
      const reg = /^1[3-9]\d{9}$/;
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        mobile: ""
      },
      row: {},
      showDialog: false,
      isLoging: false,
      listChangeCallback: null,
      // form: {},
      rules: {
        mobile: [{ required: true, trigger: "blur", validator: validatePhone }]
      }
    };
  },
  methods: {
    openDialog: function(row, callback) {
      console.log(row);
      this.showDialog = true;
      this.listChangeCallback = callback;
      if (row != null) {
        this.row = row;
      }
    },
    onSubmit: function() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/api/user/changePushKey",
            params: {
              mobile: this.userForm.mobile,
              userId: this.row.id
            }
          })
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.showDialog = false;
                this.listChangeCallback();
              } else {
                this.$message({
                  showClose: true,
                  message: "修改失败",
                  type: "error"
                });
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close: function() {
      this.showDialog = false;
      this.mobile = null;
      this.form = {};
    }
  }
};
</script>
