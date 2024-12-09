<template>
  <div id="taskEdit">
    <el-dialog
      :visible.sync="dialogVisible"
      class="custom-dialog"
      title="任务编辑"
      width="60%"
      top="0rem"
      @close="handleClose"
    >
      <div class="dialog-content-wrapper">
        <el-divider></el-divider>
        <el-form :model="taskForm" ref="taskForm" class="task-form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务编号:" style="display: inline-flex;">
                <el-input v-model="taskForm.taskId" disabled class="input-disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务名称：" style="display: inline-flex;">
                <el-input v-model="taskForm.taskName" disabled class="input-disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="所选摄像头：">
                <div class="device-tree-main-box">
                <DeviceTreeNational
                    v-if="playerAction === 'national'"
                ></DeviceTreeNational>
                <DeviceTreeProxy ref="deviceComponent" @checkEvent="handleDeviceSelected"
                    v-if="playerAction === 'proxy'"
                ></DeviceTreeProxy>
                <DeviceTreeNationalCockpit
                    v-if="playerAction === 'nationalCockpit'"
                ></DeviceTreeNationalCockpit>
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
              <el-form-item label="所选时间段:">
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
import { ref, defineComponent } from "vue";
import Day from "../Day.vue";
import DeviceTreeNational from "../common/DeviceTreeNational.vue";
import DeviceTreeNationalCockpit from "../common/DeviceTreeNationalCockpit.vue";
import DeviceTreeProxy from "../common/DeviceTreeProxy_patrol.vue";
import { mixin } from "../../utils/mixin";
import axios from "axios";

export default defineComponent({
  name: "taskEdit",
  components: {
    Day,
    DeviceTreeNational,
    DeviceTreeNationalCockpit,
    DeviceTreeProxy,
  },
  mixins: [mixin],
  setup( props, { emit } ) {
    const dialogVisible = ref(false);
    const taskForm = ref({
      taskId: "",
      taskName: "",
      selectedHours: [],
      startDate: "",
      endDate: "",
      isUnlimited: false,
      taskRule: '0',
      selectedCameras: [],
    });

    const selectedDevice = ref([]);
    const playerAction = ref("national");
    const deviceComponent = ref(null);
    const dayComponent = ref(null);
    const pickerOptions = {
      disabledDate(time) {
        return time.getTime() < Date.now();
      }
    };

    const openDialog = (task) => {
      dialogVisible.value = true;
      taskForm.value = task;
      playerAction.value = task.playerAction;
      taskForm.value.taskRule = "0";
      console.log("任务编辑：", taskForm.value);
      if(deviceComponent.value){
        deviceComponent.value.refresh();
      };
      if (dayComponent.value) {
        dayComponent.value.resetSelection();
      };
    };

    const closeDialog = () => {
      dialogVisible.value = false;
      taskForm.value = {
        taskId: "",
        taskName: "",
        selectedHours: [],
        startDate: "",
        endDate: "",
        isUnlimited: false,
        taskRule: 0,
        selectedCameras: [],
      };
      selectedDevice.value = [];
      emit("success");
    };

    const handleClose = () => {
      closeDialog();
    };

    const handleCancel = () => {
      handleClose();
    };

    const handleDeviceSelected = (id) => {
      selectedDevice.value.push(id);
      taskForm.value.selectedCameras = selectedDevice.value.join(',');
      console.log("选中的摄像头：", taskForm.value.selectedCameras);
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

    const handleTimeSelected = (selectedHours) => {
      // 重置选中时间段列表
      taskForm.value.selectedHours = [];
      taskForm.value.selectedHours = selectedHours;
    };
    // const handleUnlimitedChange = (e) => {
    //   taskForm.value.isUnlimited = e;
    // };

    const handleSave = () => {
      axios.post("/api/patrol/route_task/edit", taskForm.value).then((res) => {
        closeDialog();
        alert("修改任务成功");
      }).catch((err) => {
        console.log('修改任务失败', err);
        alert("修改任务失败");
      });
    };

    return {
      dialogVisible,
      taskForm,
      pickerOptions,
      selectedDevice,
      openDialog,
      closeDialog,
      playerAction,
      handleClose,
      handleCancel,
      handleSave,
      handleDeviceSelected,
      handleTimeSelected,
      // handleUnlimitedChange,
      deviceComponent,
      dayComponent,
      handleDateSelected,
    };
  },
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

.task-form {
  text-align: left;
  margin-top: -10px;
}

.input-disabled {
  margin-left: 21px;
  width: 250px;
}

.device-tree-main-box {
  text-align: left;
  width: 350px;
  overflow-y: auto;
  height: 180px;
  border: 1px solid #d2d2d2;
  border-radius: 4px;
  padding: 10px;
  background-color: #f2f2f2;
  margin-top: 10px;
}

.date-picker-box {
  width: 370px;
  margin-left: 12px;
  border: 1px solid #d2d2d2;
}

.time-container {
  width: 100%;
  margin-top: 7px;
}

.day-container {
  width: 70%;
}

.el-radio-group {
  display: flex;
  flex-direction: row; /* 更改为 row 以水平排列子元素 */
  flex-wrap: nowrap;  /* 防止子元素换行 */
}

.el-radio {
  margin-bottom: 10px;
}

.el-checkbox {
  font-size: 30px;
}

.dialog-footer {
  text-align: center;
  padding: 10px 20px;
  border-radius: 0 0 3px 3px;
  margin-top:-10px;
}

</style>
