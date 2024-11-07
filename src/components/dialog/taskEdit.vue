<template> 
  <div id="taskEdit">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="任务编辑"  
      width="60%"  
      top="2rem" 
      @close="handleClose" 
    >  
      <el-form :model="taskForm" ref="taskForm" class="task-form"> 
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号" :label-width="formLabelWidth">  
              <el-input v-model="taskForm.taskId" disabled></el-input>  
            </el-form-item>
          </el-col>
          <el-col :span="12">      
            <el-form-item label="路线名称" :label-width="formLabelWidth">  
              <el-input v-model="taskForm.routeName" disabled></el-input>  
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="所选摄像头" :label-width="formLabelWidth">  
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
            <el-form-item label="所选时间段" :label-width="formLabelWidth">  
              <div class="time-container">  
                <Day class="day-container" v-model="taskForm.selectedHours" @selected-hours-changed="handleTimeSelected"></Day>  
              </div>
            </el-form-item>
        </el-row>
        <el-row>告警图片采集规则:
          <input type="radio" id="alert-all" value="all" v-model="alertRule" @selected="handleAlertRuleChange" />
          <label for="alert-all">采集全部告警图片</label>
          <input type="radio" id="alert-part" value="part" v-model="alertRule" @selected="handleAlertRuleChange" />
          <label for="alert-part">当时段内首次和尾次告警图片</label>
          <input type="radio" id="alert-none" value="none" v-model="alertRule" @selected="handleAlertRuleChange" />
          <label for="alert-none">不保存</label>
        </el-row>
        <el-form-item>  
          <div style="float: right;">  
            <el-button @click="handleCancel">取消</el-button>  
            <el-button type="primary" @click="handleSave">确认</el-button>  
          </div> 
        </el-form-item>  
      </el-form> 
    </el-dialog> 
  </div> 
</template>  
  
<script>  
import { ref, reactive } from "vue";  
import Day from "../Day.vue";
import DeviceTreeNational from "../common/DeviceTreeNational.vue";
import DeviceTreeNationalCockpit from "../common/DeviceTreeNationalCockpit.vue";
import DeviceTreeProxy from "../common/DeviceTreeProxy_patrol.vue";
import { mixin } from "../../utils/mixin";
export default { 
  name: "TaskEdit",  
  components: {
        Day,
        DeviceTreeNational,
        DeviceTreeNationalCockpit,
        DeviceTreeProxy,
  },  
  mixins: [mixin],  
  setup() {  
    const selectedDevice = []; 
    const startDate = ref('');  
    const endDate = ref('');  
    const isUnlimited = ref(false);  
    const alertRule = ref('all'); 
    //勾选无限期将日期范围设置为今天到2099-12-31
    const handleUnlimitedChange = () => { 
      const taskForm = reactive({  
        startDate: '',  
        endDate: ''  
      });  
      if (isUnlimited.value) { 
        const today = new Date();  
        const futureDate = new Date(2099, 11, 31);  
        startDate.value = today.toISOString().split('T')[0];  
        endDate.value = futureDate.toISOString().split('T')[0];  
        console.log("日期范围设置为"+startDate.value+"到"+endDate.value);  
    }};

     // 处理告警图片采集规则选择事件
     const handleAlertRuleChange = (rule) => {
      alertRule.value = rule;
    };
    return {  
      selectedDevice,  
      startDate,  
      endDate,  
      isUnlimited,  
      alertRule,
      handleUnlimitedChange,
      handleAlertRuleChange,  
    };  
  },  
  data() {  
    return {  
      dialogVisible: false,  
      formLabelWidth: '100px', 
      taskForm: {  
        taskId: '',  
        routeName: '', 
        selectedCameras: '',  
        startDate: '',  
        endDate: '',  
        selectedHours: [],  
      },  
      originalTask: {}, // 用于存储原始数据，以便在取消时恢复  
    };  
  },  
  methods: {  
    // 打开对话框并传入路线数据  
    openDialog(task, callback) {  
      this.originalTask = { ...task }; // 存储原始数据  
      this.taskForm = { ...task }; // 填充表单数据  
      this.dialogVisible = true;  
      this.$nextTick(() => {  
        this.$refs.taskForm.clearValidate(); // 清除表单验证  
      });  
    },  
    // 关闭对话框（无论是否保存）  
    handleClose() {  
      this.dialogVisible = false;  
      this.selectedDevice = []; // 清空选中的设备列表  
      this.isUnlimited = false; // 复选框复位  
      this.alertRule = 'all'; // 告警图片采集规则复位  
    },  
    // 取消编辑，恢复原始数据  
    handleCancel() {  
      this.taskForm = { ...this.originalTask };  
      this.handleClose();  
    },  
    // 处理设备选择 
    handleDeviceSelected(id) {
      this. selectedDevice.push(id);
      this.routeForm.selectedCameras = this.selectedDevice.join(',');
      console.log("选中的摄像头：", this.selectedDevice);
    },  
    // 处理时间段选择  
    handleTimeSelected(finalSelectedHours) {  
      this.taskForm.selectedHours = finalSelectedHours;  
      console.log('选择的时间段:', finalSelectedHours);  
    },  
    // 保存编辑后的数据到route_task/edit API  
    async handleSave() {  
      try {  
        this.$refs.taskForm.validate(async (valid) => {  
          if (valid) {  
            // 调用route_task/edit API  
            const response = await this.$axios.post(  
              '/api/patrol/route_task/edit',  
              this.taskForm  
            );  
            if (response.data.code === 0) {  
              // 假设保存成功  
              this.handleClose();  
              this.$emit('save-success', this.taskForm);  
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
  }, 
};  
</script>  

<style scoped> 
.task-form {  
  text-align: left;  
  margin-top: -10px;
}  
.device-tree-main-box {
  text-align: left;
  width: 50%;
  overflow-y: auto;
  height: 180px;
  margin-top: 10px;  
}

.time-container {  
  width: 100%;
}  
  
.day-container {  
  width: 70%;
}  

.el-checkbox {
  font-size: 30px;
}

</style>