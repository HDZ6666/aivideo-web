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
      <div class="dialog-content-wrapper">
        <el-divider></el-divider>
        <el-form class="form-container">  
          <el-row >巡逻任务名称: 
            <input type="text" id="taskName" v-model="taskForm.taskName" class="input-box" placeholder="请输入"></el-row> 
          <el-row>
            <el-form-item label="选择摄像头:">  
                <div class="device-tree-main-box">
                  <el-tabs v-model="activeTab" type="card" class="device-tree-tabs">
                    <el-tab-pane label="国标设备" name="global">
                      <DeviceTreeNational 
                          ref="deviceComponent" 
                          @checkEvent="handleDeviceChecked" 
                          v-if="playerAction === 'national'"
                      ></DeviceTreeNational>
                      <!-- <DeviceTreeNationalCockpit
                          v-if="playerAction === 'nationalCockpit'"
                      ></DeviceTreeNationalCockpit>  -->
                    </el-tab-pane>
                    <el-tab-pane label="非国标设备" name="fox">
                      <DeviceTreeProxy 
                          ref="deviceComponent" 
                          @checkEvent="handleDeviceChecked" 
                          v-if="playerAction === 'proxy'">
                      </DeviceTreeProxy>
                    </el-tab-pane>
                  </el-tabs>
                </div>
            </el-form-item>    
          </el-row>
          <el-row>
            <!-- <el-col :span="20"> -->
              <el-form-item label="任务排期：" style="display: inline-flex;">
                <el-date-picker
                  v-model="taskForm.dateRange"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="handleDateSelected"
                  class="date-picker-box"
                ></el-date-picker>
              </el-form-item>
            <!-- </el-col>
            <el-col :span="3">  
              <el-form-item label="是否无限期">  
                <el-checkbox v-model="taskForm.isUnlimited" @change="handleUnlimitedChange"></el-checkbox>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>       
              <el-form-item label="选择时间段：">  
                <div class="time-container">  
                  <Day ref="dayComponent" class="day-container" v-model="taskForm.selectedHours" @selected-hours-changed="handleTimeSelected"></Day>  
                </div>
              </el-form-item>
          </el-row>
          <el-row type="flex" align="center">告警图片采集规则:
            <el-radio-group v-model="taskForm.taskRule" inline style=" margin-left: 10px;" >
              <el-radio label="0">采集全部告警图片，如无告警则采集当时段内首次和尾次图片</el-radio>
              <!-- <el-radio label="1">采集全部告警图片</el-radio>
              <el-radio label="2">不保存</el-radio> -->
            </el-radio-group>
          </el-row>
        </el-form>  
        <div slot="footer" class="dialog-footer">  
          <el-button type="primary" @click="handleSave">确定</el-button>  
          <el-button @click="handleCancel">取消</el-button>  
        </div> 
      </div> 
    </el-dialog> 
  </div> 
</template>  
  
<script>  
import { ref, defineComponent } from 'vue';  
import axios from 'axios';
import DeviceTreeNational from "../common/DeviceTreeNational_patrol.vue";
// import DeviceTreeNationalCockpit from "../common/DeviceTreeNationalCockpit.vue";
import DeviceTreeProxy from "../common/DeviceTreeProxy_patrol.vue";
import { mixin } from "../../utils/mixin";
import Day from "../Day.vue";  

export default defineComponent({  
  name: 'taskAdd',  
  components: {
    DeviceTreeNational,
    // DeviceTreeNationalCockpit,
    DeviceTreeProxy,
    Day
  },
  mixins: [mixin],
  setup( props, { emit }) { 
    const dialogVisible = ref(false); 
    const selectedDeviceIds = ref([]);
    const taskForm= ref({  
      taskId: '',  
      selectedCameras: [],  
      taskName: '',  
      playerAction: '',
      startDate: '',  
      endDate: '',  
      selectedHours: [],  
      isUnlimited: false,  
      taskRule: '0'
    });  
    const taskStatus = ref('0');
    const deviceComponent = ref(null);
    const dayComponent = ref(null);
    const pickerOptions = {
      disabledDate(time) {
        return time.getTime() < Date.now();
      }
    }; 
    
    // 打开对话框  
    const openDialog = () => {  
      dialogVisible.value = true;  
      if (deviceComponent.value) {
        deviceComponent.value.resetSelection(); 
      };
      if (dayComponent.value) {
        dayComponent.value.resetSelection(); 
      };
    };  
    
    // 关闭对话框  
    const closeDialog = () => {  
      dialogVisible.value = false; 
      // 清空表单数据  
      taskForm.value = {  
        taskName: '',  
        selectedCameras: [],  
        startDate: '',  
        endDate: '',  
        selectedHours: [],  
        isUnlimited: false,  
        taskRule: '0'
      };
      selectedDeviceIds.value = [];
      emit('success')
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
    const handleDeviceChecked = (event) => {
      const { deviceId, channelId,checked } = event;
      const newId = deviceId+'-'+channelId+'-国标';
      const index = selectedDeviceIds.value.indexOf(newId);
      if (checked && index === -1) {
        selectedDeviceIds.value.push(newId);
      } else if (!checked && index !== -1) {
        selectedDeviceIds.value.splice(index, 1);
      }
      taskForm.value.selectedCameras = selectedDeviceIds.value.join(',');
      console.log("选中摄像头：", selectedDeviceIds.value);
    };
    // 切换事件
    const activeTab = ref('global');
    const handleTabChange = (tabName) => {
      activeTab.value = tabName;
      console.log("切换到：", activeTab.value);
    };
    
    // 处理日期选择事件，任务结束日期不能早于开始日期，且范围在当天之后的一年范围内，如超出则提醒用户  
    const handleDateSelected = (value) => {
      const [startDate, endDate] = value; // 解构出开始日期和结束日期
      taskForm.value.startDate = startDate;
      taskForm.value.endDate = endDate;
 
      // 转换为Date对象进行比较
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
 
      if (end && start && start > end) {
        alert('结束日期不能早于开始日期');
        taskForm.value.dateRange[1] = ''; // 清空结束日期
      } else if (end && end > new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())) {
        alert('结束日期不能超过当前日期一年');
        taskForm.value.dateRange[1] = ''; // 清空结束日期
      } 
    };
    // 处理时间选择事件  
    const handleTimeSelected = (hours) => {  
      taskForm.value.selectedHours = hours; 
    };  
    //勾选无限期将日期范围设置为今天到2099-12-31
    // const handleUnlimitedChange = () => {  
    //   if (taskForm.value.isUnlimited) {  
    //       const today = new Date();  
    //       const futureDate = new Date(2099, 11, 31);  
    //       taskForm.value.startDate = today.toISOString().split('T')[0];  
    //       taskForm.value.endDate = futureDate.toISOString().split('T')[0];  
    //       console.log("日期范围设置为"+taskForm.value.startDate+"到"+taskForm.value.endDate);  
    //   } else {  
    //     taskForm.value.startDate = '';  
    //     taskForm.value.endDate = '';
    //   }  
    // };

    // 保存编辑后的数据到route/edit API  
    const handleSave = async () => {  
      // 表单验证  
      try {  
        if (taskForm.value.taskName === '') {  
          alert('请输入任务名称');  
          return;  
        }  
        if (selectedDeviceIds.value.length === 0) {  
          alert('请选择摄像头');  
          return;  
        }  
        if (taskForm.value.startDate === '') {  
          alert('请选择任务排期');  
          return;  
        }  
        if (taskForm.value.endDate === '') {  
          alert('请选择任务排期');  
          return; 
        }  
        if (taskForm.value.selectedHours.length === 0) {  
          alert('请选择时间段');  
          return;   
        }  
        // 发送请求保存数据  
        const response = await axios.post('/api/patrol/route_task/add',  
          { 
            ...taskForm.value,  
            taskStatus: '0',
          });  
        // 假设保存成功  
        closeDialog();
        alert('添加任务成功'); 
        // 清空表单数据  
        taskForm.value = {  
          taskName: '',  
          selectedCameras: [],  
          startDate: '',  
          endDate: '',  
          selectedHours: [],  
          isUnlimited: false,   
          taskRule: '0'
        };
      } catch (error) {  
        console.log(error);  
        alert('添加任务失败');  
      }  
    };  

    return {  
      dialogVisible, 
      taskForm,
      taskStatus,  
      openDialog,  
      handleClose,  
      handleCancel,  
      handleSave,  
      handleTimeSelected,  
      // handleUnlimitedChange, 
      deviceComponent,
      dayComponent, 
      handleDateSelected,
      pickerOptions,
      activeTab,
      handleTabChange,
      selectedDeviceIds,
      handleDeviceChecked,
    };  
  } 
});  
</script>  

<style scoped>  
.custom-dialog {  
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);  
  border-radius: 8px;  
  text-align: left;  
  font-weight: bold;    
}  

.dialog-content-wrapper {
  margin-top: -50px; 
}
  
.form-container {  
  padding: 10px;  
  text-align: left;  
  margin-top: -20px;
}  

.input-box {  
  width:350px; 
  height: 30px;
  margin-left:6px;  
  padding: 0 10px;  
  border: 1px solid #d2d2d2; 
  border-radius: 4px;  
  margin-bottom: 10px;
  background-color: #f2f2f2;  
}

input:focus {
  border-color: #409EFF;
  outline: none;
}

input::placeholder {
  color: #d0d0d0;
}

.device-tree-main-box {  
  text-align: left; 
  margin-left:100px; 
  width: 350px;  
  overflow-y: auto;  
  height: 180px;  
  border: 1px solid #d2d2d2;  
  border-radius: 4px;  
  padding: 10px;  
  background-color: #f2f2f2;  
  margin-top: 10px;  
}  

.device-tree-tabs {
  margin-top: -10px;
}

.date-picker-box {  
  width: 370px;  
  margin-left: 19px;  
  border: 1px solid #d2d2d2;  
}
  
.time-container {    
  width: 100%;  
  margin-top: 7px;  
}    
  
.day-container {    
  width: 70%; 
}    
  
.dialog-footer {  
  text-align: center;  
  padding: 10px 20px;   
  border-radius: 0 0 3px 3px;  
  margin-top:-10px;
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
  flex-direction: row; /* 更改为 row 以水平排列子元素 */
  flex-wrap: nowrap;  /* 防止子元素换行 */
}  
  
.el-radio {  
  margin-bottom: 10px;  
}  

/* .el-checkbox {
  font-size: 30px;
} */

</style>