<template>
  <el-dialog v-model="open" title="新增任务" width="min(960px, 96vw)" top="4vh" append-to-body destroy-on-close @closed="reset">
    <div class="patrol-dialog-body">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="patrol-task-form">
      <el-form-item label="巡检任务名称" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入任务名称" clearable />
      </el-form-item>

      <el-form-item label="选择摄像头" prop="selectedCameras">
        <div class="selector-box">
          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="国标设备" name="national">
              <DeviceTreeNationalPatrol ref="nationalTreeRef" @check-event="handleDeviceChecked" />
            </el-tab-pane>
            <el-tab-pane label="非国标设备" name="proxy">
              <DeviceTreeProxyPatrol ref="proxyTreeRef" @check-event="handleDeviceChecked" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="selected-text">{{ selectedDeviceIds.join(',') || '未选择摄像头' }}</div>
      </el-form-item>

      <el-form-item label="任务排期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled-date="disabledDate"
          style="width: 100%"
          @change="handleDateSelected"
        />
      </el-form-item>

      <el-form-item label="选择时间段" prop="selectedHours">
        <PatrolDay ref="dayRef" @selected-hours-changed="handleTimeSelected" />
      </el-form-item>

      <el-form-item label="采集规则">
        <el-radio-group v-model="form.taskRule" class="task-rule-group">
          <el-radio label="0">采集全部告警图片，如无告警则采集当时段内首次和尾次图片</el-radio>
        </el-radio-group>
      </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'
import DeviceTreeNationalPatrol from '@/components/video/DeviceTreeNationalPatrol/index.vue'
import DeviceTreeProxyPatrol from '@/components/video/DeviceTreeProxyPatrol/index.vue'
import PatrolDay from '@/components/video/PatrolDay/index.vue'

const emit = defineEmits(['success'])
const open = ref(false)
const loading = ref(false)
const formRef = ref(null)
const dayRef = ref(null)
const nationalTreeRef = ref(null)
const proxyTreeRef = ref(null)
const activeTab = ref('national')
const selectedDeviceIds = ref([])
const form = reactive(createForm())
const rules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  selectedCameras: [{ required: true, message: '请选择摄像头', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择任务排期', trigger: 'change' }],
  selectedHours: [{ required: true, message: '请选择时间段', trigger: 'change' }]
}

function createForm() {
  return {
    taskName: '',
    selectedCameras: '',
    dateRange: [],
    startDate: '',
    endDate: '',
    selectedHours: [],
    isUnlimited: false,
    taskRule: '0'
  }
}

function openDialog() {
  open.value = true
}

function disabledDate(time) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nextYear = new Date(today)
  nextYear.setFullYear(today.getFullYear() + 1)
  return time.getTime() < today.getTime() || time.getTime() > nextYear.getTime()
}

function handleDeviceChecked(event) {
  const cameraId =
    event.source === 'proxy'
      ? event.cameraId
      : `${event.deviceId}-${event.channelId}-国标`
  const index = selectedDeviceIds.value.indexOf(cameraId)

  if (event.checked && index === -1) {
    selectedDeviceIds.value.push(cameraId)
  } else if (!event.checked && index !== -1) {
    selectedDeviceIds.value.splice(index, 1)
  }

  form.selectedCameras = selectedDeviceIds.value.join(',')
  formRef.value?.validateField('selectedCameras')
}

function handleDateSelected(value) {
  form.startDate = value?.[0] || ''
  form.endDate = value?.[1] || ''
}

function handleTimeSelected(hours) {
  form.selectedHours = hours
  formRef.value?.validateField('selectedHours')
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    loading.value = true
    request({
      method: 'post',
      url: '/api/patrol/route_task/add',
      data: {
        ...form,
        taskStatus: '0'
      }
    })
      .then(() => {
        ElMessage.success('添加任务成功')
        emit('success')
        close()
      })
      .finally(() => {
        loading.value = false
      })
  })
}

function close() {
  open.value = false
}

function reset() {
  formRef.value?.resetFields()
  dayRef.value?.resetSelection()
  nationalTreeRef.value?.resetSelection()
  proxyTreeRef.value?.resetSelection()
  selectedDeviceIds.value = []
  activeTab.value = 'national'
  Object.assign(form, createForm())
}

defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.patrol-dialog-body {
  max-height: calc(92vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

.patrol-task-form {
  min-width: 0;
}

.selector-box {
  width: 100%;
  max-height: 220px;
  overflow: auto;
  padding: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.selected-text {
  width: 100%;
  max-height: 60px;
  overflow: auto;
  margin-top: 6px;
  color: #606266;
  line-height: 20px;
  word-break: break-all;
}

.task-rule-group {
  width: 100%;
}

.task-rule-group :deep(.el-radio) {
  height: auto;
  line-height: 22px;
  white-space: normal;
}

.task-rule-group :deep(.el-radio__label) {
  white-space: normal;
  word-break: break-all;
}
</style>
