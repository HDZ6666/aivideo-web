<template> 
  <div id="taskEdit">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="任务编辑"  
      width="60%"  
      top="7rem"
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
              <el-input v-model="taskForm.selectedCameras" disabled></el-input>  
            </el-form-item> 
        </el-row>
        <el-row>
          <el-col :span="12">  
            <el-form-item label="开始日期" :label-width="formLabelWidth">  
              <el-input type="date" v-model="taskForm.startDate"></el-input>  
            </el-form-item> 
          </el-col>
          <el-col :span="12">  
            <el-form-item label="结束日期" :label-width="formLabelWidth">  
              <el-input type="date" v-model="taskForm.endDate"></el-input>  
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
import Day from "../Day.vue";
export default { 
  name: "TaskEdit",  
  components: {
        Day,
    }, 
  data() {  
    return {  
      dialogVisible: false,  
      formLabelWidth: '100px', 
      taskForm: {  
        taskId: '',  
        routenName: '', 
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
    },  
    // 取消编辑，恢复原始数据  
    handleCancel() {  
      this.taskForm = { ...this.originalTask };  
      this.handleClose();  
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
.time-container {  
  width: 100%;
}  
  
.day-container {  
  width: 70%;
}  
</style>