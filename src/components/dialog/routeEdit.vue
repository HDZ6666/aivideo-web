<template> 
  <div id="routeEdit">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="路线编辑"  
      width="30%"  
      @close="handleClose"  
    >  
      <el-form :model="routeForm" ref="routeForm">  
        <el-form-item label="路线编号" :label-width="formLabelWidth">  
          <el-input v-model="routeForm.routeID" disabled></el-input>  
        </el-form-item>  
        <el-form-item label="路线名称" :label-width="formLabelWidth">  
          <el-input v-model="routeForm.routename"></el-input>  
        </el-form-item>
        <el-form-item label="所选摄像头" :label-width="formLabelWidth">  
          <el-tree
            ref="groupTree"
            class="el-tree"
            node-key="id"
            default-expand-all
            :data="deviceGroupList"
            :props="treeProps"
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleNodeClick"
            show-checkbox
            > 
        </el-tree>
        </el-form-item>    
      </el-form>  
      <div slot="footer" class="dialog-footer">  
        <el-button @click="handleCancel">取消</el-button>  
        <el-button type="primary" @click="handleSave">确认</el-button>  
      </div>  
    </el-dialog> 
  </div> 
</template>  
  
<script>  
export default {  
  name: 'routeEdit',  
  data() {  
    return {  
      getDeviceGroupLoading: false,
      deviceGroupList: [],
      treeProps: {
          children: "children",
          label: "group_name"
      },
      dialogVisible: false,  
      formLabelWidth: '120px',  
      routeForm: {  
        routeID: '',  
        routename: '', 
      },  
      originalRoute: {}, // 用于存储原始数据，以便在取消时恢复  
    };  
  },  
  methods: {  
    // 打开对话框并传入路线数据  
    openDialog(route, callback) {  
      this.originalRoute = { ...route }; // 存储原始数据  
      this.routeForm = { ...route }; // 填充表单数据  
      this.dialogVisible = true;  
      this.$nextTick(() => {  
        this.$refs.routeForm.clearValidate(); // 清除表单验证  
      });  
      callback && callback(); // 回调，可用于关闭可能已打开的其他对话框  
    },  
    // 关闭对话框（无论是否保存）  
    handleClose() {  
      this.dialogVisible = false;  
    },  
    // 取消编辑，恢复原始数据  
    handleCancel() {  
      this.routeForm = { ...this.originalRoute };  
      this.handleClose();  
    },  
    // 保存编辑后的数据  
    async handleSave() {  
      try {  
        // 校验表单  
        this.$refs.routeForm.validate((valid) => {  
          if (valid) {  
            // 假设调用API保存数据  
            // 注意：这里应替换为实际的API调用和数据处理逻辑  
            console.log('保存数据:', this.routeForm);  
              
            // 假设保存成功，关闭对话框  
            this.handleClose();  
              
            // 可选：通知父组件或执行其他操作  
            this.$emit('save-success', this.routeForm);  
          } else {  
            console.log('表单验证失败');  
            return false;  
          }  
        });  
      } catch (error) {  
        console.error('保存数据时发生错误:', error);  
      }  
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
        return this.$refs.groupTree.getNode(id);
    },
    handleNodeClick(data) {
        this.$emit("changeGroup", data);
    },
  }, 
  
  mounted() {
      this.getDeviceGroup();   
  }, 
};  
</script>  

<style scoped>  
.el-tree {  
    height: 300px; /* 设置固定高度 */ 
    width: 250px; 
    overflow-y: auto; /* 允许垂直滚动 */  
    border: 1px solid #ccc; /* 添加方框 */  
    background-color: #f9f9f9; /* 设置背景色 */  
}
</style>