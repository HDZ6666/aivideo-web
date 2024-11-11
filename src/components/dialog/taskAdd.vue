<template> 
  <div id="taskAdd">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      class="custom-dialog"
      title="新增任务"  
      width="60%"  
      top="2rem"
      @close="handleClose"  
    >  
      <el-form class="form-container">  
        <el-row for="routeName">巡逻路线名称: 
        <input type="text" id="routeName" v-model="routeName" /></el-row> 
        <el-row>
          <el-form-item label="选择摄像头:">  
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
          </el-form-item>    
        </el-row>

        <el-row>
          <el-col :span="9"> 
            <el-form-item label="开始日期" :label-width="formLabelWidth">  
              <el-date-picker v-model="taskForm.startDate"></el-date-picker>  
            </el-form-item> 
          </el-col>
          <el-col :span="10">  
            <el-form-item label="结束日期" :label-width="formLabelWidth">  
              <el-date-picker v-model="taskForm.endDate"></el-date-picker> 
            </el-form-item>
          </el-col>
          <el-col :span="3">  
            <el-form-item label="是否无限期" :label-width="formLabelWidth">  
              <el-checkbox v-model="isUnlimited" @change="handleUnlimitedChange"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
    
        <el-row>       
            <el-form-item label="选择时间段：">  
              <div class="time-container">  
                <Day class="day-container" v-model="taskForm.selectedHours" @selected-hours-changed="handleTimeSelected"></Day>  
              </div>
            </el-form-item>
        </el-row>
        <el-row>告警图片采集规则:
          <!-- <input type="radio" id="alert-all" value="all" v-model="alertRule" @selected="handleAlertRuleChange" />
          <label for="alert-all">采集全部告警图片</label> -->
          <input type="radio" id="alert-part" value="part" v-model="alertRule" />
           <!-- @selected="handleAlertRuleChange" /> -->
          <label for="alert-part">当时段内首次和尾次图片</label>
          <!-- <input type="radio" id="alert-none" value="none" v-model="alertRule" @selected="handleAlertRuleChange" />
          <label for="alert-none">不保存</label> -->
        </el-row>
      </el-form>  
      <div slot="footer" class="dialog-footer">  
        <el-button @click="handleCancel">取消</el-button>  
        <el-button type="primary" @click="handleSave">确认</el-button>  
      </div>  
    </el-dialog> 
  </div> 
</template>  
  
<script>  
import { ref } from 'vue';  
import axios from 'axios';
import DeviceTreeNational from "../common/DeviceTreeNational.vue";
import DeviceTreeNationalCockpit from "../common/DeviceTreeNationalCockpit.vue";
import DeviceTreeProxy from "../common/DeviceTreeProxy_patrol.vue";
import { mixin } from "../../utils/mixin";
import Day from "../Day.vue";  
export default {  
  name: 'taskAdd',  
  components: {
    DeviceTreeNational,
    DeviceTreeNationalCockpit,
    DeviceTreeProxy,
    Day
  },
  mixins: [mixin],
  setup() { 
    const taskList = ref([]); 
    const dialogVisible = ref(false);  
    const routeId = ref('');  
    const selectedCameras = ref([]);  
    const routeName = ref('');   
    const playerAction = ref('national');  
    const startDate = ref('');  
    const endDate = ref('');  
    const selectedHours = ref([]);   
    const isUnlimited = ref(false);  
    const taskForm= ref({  
      routeId: '',  
      selectedCameras: [],  
      routeName: '',  
      playerAction: '',  
      startDate: '',  
      endDate: '',  
      selectedHours: [],  
      isUnlimited: false,  
      devices: []  ,
      alertRule: ''
    });  
    const formLabelWidth = '100px';  
    const alertRule = ref('0');
    
    // 打开对话框  
    const openDialog = () => {  
      dialogVisible.value = true;  
    };  
    
    // 关闭对话框  
    const closeDialog = () => {  
      dialogVisible.value = false;  
    };  
    
    // 处理关闭对话框事件  
    const handleClose = () => {  
      closeDialog();  
    };  
    
    // 处理取消按钮点击事件  
    const handleCancel = () => {  
      closeDialog();  
      // 关闭对话框（无论是否保存）  
      handleClose()  
    };  
    // 处理摄像头选择事件  
    const handleDeviceSelected = (device) => {  
      taskForm.value.devices.push(device);  
    };  
    // 处理时间选择事件  
    const handleTimeSelected = (hours) => {  
      selectedHours.value = hours;  
    };  
    //勾选无限期将日期范围设置为今天到2099-12-31
    const handleUnlimitedChange = () => {  
      if (isUnlimited.value) {  
          const today = new Date();  
          const futureDate = new Date(2099, 11, 31);  
          startDate.value = today.toISOString().split('T')[0];  
          endDate.value = futureDate.toISOString().split('T')[0];  
          console.log("日期范围设置为"+startDate.value+"到"+endDate.value);  
      }  
    };
    
    // 处理告警图片采集规则选择事件默认为0
    // const handleAlertRuleChange = (rule) => {  
    //   alertRule.value = rule;
    // };

    // 保存编辑后的数据到route/edit API  
    const handleSave = async () => {  
      // 表单验证  
      try {  
        const response = await axios.post('/api/patrol/route/add',  
          {  
            routeId: routeId.value,
            routeName: routeName.value,  
            selectedCameras: selectedCameras.value,  
            startDate: startDate.value,  
            endDate: endDate.value, 
            selectedHours: selectedHours.value, 
            alertRule: alertRule.value,
            taskStatus: '0',
          });  
        taskList.value = response.data.data;  
        // 假设保存成功  
        handleClose();  
        alert('添加任务成功'); 
        // 清空表单数据  
        routeId.value = '';  
        selectedCameras.value = [];  
        startDate.value = null;  
        endDate.value = null;  
        selectedHours.value = []; 
        isUnlimited.value = false;  
        alertRule.value = '0';
        } catch (error) {  
          console.error('保存数据时发生错误:', error);  
          alert('添加任务失败:');
      }  
    };  

    return {  
      taskList, 
      dialogVisible, 
      formLabelWidth, 
      routeId,
      selectedCameras,  
      routeName,  
      playerAction,  
      startDate,  
      endDate,  
      selectedHours,  
      isUnlimited,  
      alertRule,  
      taskForm,  
      openDialog,  
      closeDialog,  
      handleClose,  
      handleCancel,  
      handleSave,  
      handleDeviceSelected,  
      handleTimeSelected,  
      handleUnlimitedChange,  
      // handleAlertRuleChange,  
    };  
  }  
};  
</script>  

<style scoped>  
.custom-dialog {  
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);  
  border-radius: 8px;  
}  
  
.form-container {  
  padding: 10px;  
  text-align: left;  
  margin-top: -20px;
}  
  
.device-tree-main-box {  
  text-align: left;  
  width: 50%;  
  overflow-y: auto;  
  height: 180px;  
  border: 1px solid #ebeef5;  
  border-radius: 4px;  
  padding: 10px;  
  background-color: #f5f7fa;  
  margin-top: 10px;  
}  
  
.time-container {    
  width: 100%;  
  margin-top: 10px;  
}    
  
.day-container {    
  width: 73%; 
}    
  
.dialog-footer {  
  text-align: right;  
  padding: 10px 20px;  
  background-color: #f5f7fa;  
  border-top: 1px solid #ebeef5;  
  border-radius: 0 0 3px 3px;  
  margin-top:-30px;
}    
  
.el-form-item {  
  margin-bottom: 20px;  
}  
  
.el-button {  
  padding: 10px 20px;  
  border-radius: 4px;  
}  
  
.el-button--primary {  
  background-color: #409EFF;  
  border-color: #409EFF;  
}  
  
.el-button--primary:hover {  
  background-color: #66b1ff;  
  border-color: #66b1ff;  
}  
  
.el-button--cancel {  
  background-color: #ffffff;  
  border-color: #dcdcdc;  
  color: #333333;  
}  
  
.el-button--cancel:hover {  
  background-color: #f2f2f2;  
  border-color: #f2f2f2;  
  color: #333333;  
}  
  
.el-switch__core {  
  width: 50px;  
  height: 24px;  
  border-radius: 12px;  
}  
  
.el-switch__core::before {  
  width: 22px;  
  height: 22px;  
  border-radius: 50%;  
}  
  
.el-switch.is-checked .el-switch__core {  
  background-color: #409EFF;  
  border-color: #409EFF;  
}  
  
.el-switch.is-checked .el-switch__core::before {  
  transform: translateX(26px);  
  background-color: #fff;  
}  
  
.el-radio-group {  
  display: flex;  
  flex-direction: column;  
}  
  
.el-radio {  
  margin-bottom: 10px;  
}  

.el-checkbox {
  font-size: 30px;
}
</style>