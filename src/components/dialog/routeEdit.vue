<template> 
  <div id="routeEdit">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="路线编辑"  
      width="40%"  
      @close="handleClose"  
    >  
      <el-form :model="routeForm" ref="routeForm">  
        <el-form-item label="路线编号" :label-width="formLabelWidth">  
          <el-input v-model="routeForm.routeId" disabled></el-input>  
        </el-form-item>  
        <el-form-item label="路线名称" :label-width="formLabelWidth">  
          <el-input v-model="routeForm.routeName"></el-input>  
        </el-form-item>
        <el-form-item label="所选摄像头" :label-width="formLabelWidth">  
          <el-main style="background-color: #ffffff;">   
            <div class="device-tree-main-box">
            <DeviceTreeNational
                v-if="playerAction === 'national'"
            ></DeviceTreeNational>
            <DeviceTreeProxy @checkEvent="handleDeviceSelected"
                v-if="playerAction === 'proxy'"
            ></DeviceTreeProxy>
            <DeviceTreeNationalCockpit
                v-if="playerAction === 'nationalCockpit'"
            ></DeviceTreeNationalCockpit>
            </div>
          </el-main>
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
import DeviceTreeNational from "../common/DeviceTreeNational.vue";
import DeviceTreeNationalCockpit from "../common/DeviceTreeNationalCockpit.vue";
import DeviceTreeProxy from "../common/DeviceTreeProxy_patrol.vue";
import { mixin } from "../../utils/mixin";
export default {  
  name: 'routeEdit',  
  components: {
    DeviceTreeNational,
    DeviceTreeNationalCockpit,
    DeviceTreeProxy
  },
  mixins: [mixin],
  data() {  
    return {  
      selectedDevice: [], // 选中的设备信息
      dialogVisible: false,  
      formLabelWidth: '120px',  
      routeForm: {  
        routeId: '',  
        routeName: '', 
        selectedCameras:''
      },  
      originalRoute: {}, // 用于存储原始数据，以便在取消时恢复  
    };  
  },  
  methods: {  
    // 打开对话框并传入路线数据  
    openDialog(route) {  
      this.dialogVisible = true;  
      this.routeForm = { ...route };  
      this.originalRoute = { ...route };  
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
    // 修改设备  
    handleDeviceSelected(id) {
      this. selectedDevice.push(id);
      this.routeForm.selectedCameras = this.selectedDevice.join(',');
      console.log("选中的设备：", this.selectedDevice);
    },  
    // 保存编辑后的数据到route/edit API  
    async handleSave() {  
      try {  
        this.$refs.routeForm.validate(async (valid) => {  
          if (valid) {  
            // 调用route/edit API  
            const response = await this.$axios.post(  
              '/api/patrol/route/edit',  
              this.routeForm  
            );  
            if (response.data.code === 0) {  
              // 假设保存成功  
              this.handleClose();  
              this.$emit('save-success', this.routeForm);  
            } else {  
              // 处理保存失败的情况  
              console.error('保存失败:', response.data.message);  
            }  
          } else {  
            console.log('表单验证失败');  
          }  
        });  
      } catch (error) {  
        console.error('保存数据时发生错误:', error);  
      }  
    },  
    
  }  
};  
</script>  

<style scoped>  
.device-tree-main-box {
    text-align: left;
    width: 100%;
    margin-left: -20px;
    overflow-y: auto;
    height: 280px;
}
</style>