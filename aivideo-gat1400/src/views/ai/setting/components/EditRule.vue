<template>
  <el-card shadow="never" header="告警设置">
    <el-radio-group v-model="activeTab" class="mb12">
      <el-radio-button label="area">区域设置</el-radio-button>
      <el-radio-button label="base">基础设置</el-radio-button>
    </el-radio-group>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" v-loading="loading || updateLoading">
      <div v-show="activeTab === 'area'">
        <el-form-item label="" prop="areaSet">
          <AreaCanvas v-model="form.areaSet" :bg-image="bgImage" mtype="all">
            <el-button type="primary" @click="refreshImage">刷新抓图</el-button>
            <el-button :loading="snapshotLoading" @click="saveCurrentSnapshot">保存截图</el-button>
            <el-button @click="snapshotVisible = true">历史快照</el-button>
          </AreaCanvas>
        </el-form-item>
      </div>

      <div v-show="activeTab === 'base'">
        <BaseRuleForm :form="form" :alarm-type-id="alarmTypeId" :select-deviceable="false" />
      </div>

      <el-form-item>
        <el-button @click="$emit('back')">返回</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>

    <SnapshotDialog v-model="snapshotVisible" :select="false" />
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeviceSnap, getRuleDetail, saveSnapshot, updateRule } from '@/api/ai/rule'
import { DEFAULT_AREA_SET, defaultTimelines, normalizeAreaSet, normalizeTimelines } from '../../utils'
import AreaCanvas from './AreaCanvas.vue'
import BaseRuleForm from './BaseRuleForm.vue'
import SnapshotDialog from './SnapshotDialog.vue'

const props = defineProps({
  alarmTypeId: {
    type: [String, Number],
    required: true
  },
  ruleId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['back', 'saved'])

const activeTab = ref('area')
const formRef = ref()
const loading = ref(false)
const updateLoading = ref(false)
const snapshotLoading = ref(false)
const snapshotVisible = ref(false)
const bgImage = reactive({
  url: '',
  realUrl: ''
})
const form = reactive(createForm())

const rules = {
  engine: [{ required: true, message: '请选择接入引擎', trigger: 'change' }],
  device: [{ required: true, type: 'array', min: 1, message: '请选择设备', trigger: 'change' }]
}

function createForm() {
  return {
    engine: '0',
    device: [],
    notificateType: [],
    notificatePeople: [],
    timelines: defaultTimelines(),
    splitTime: 1000,
    alarmTime: 0,
    confidence: 80,
    areaSet: { ...DEFAULT_AREA_SET },
    imgLink: '',
    isCompare: 0,
    compareMinSize: 0,
    compareMaxSize: 100,
    comparePicture: '',
    trackingEnabled: 1,
    trackingDuration: 0
  }
}

function getDetail() {
  loading.value = true
  getRuleDetail({ ruleId: props.ruleId }).then((res) => {
    Object.assign(form, {
      ...createForm(),
      ...res,
      splitTime: res.splitTime ?? res.spiltTime ?? 1000,
      timelines: normalizeTimelines(res.timelines),
      areaSet: normalizeAreaSet(res.areaSet)
    })
    bgImage.url = res.imgLink || ''
    bgImage.realUrl = res.imgLink || ''
  }).finally(() => {
    loading.value = false
  })
}

function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return
    updateLoading.value = true
    updateRule({
      ...form,
      alarmTypeId: String(props.alarmTypeId),
      ruleId: Number(props.ruleId),
      imgLink: bgImage.url
    }).then(() => {
      ElMessage.success('操作成功')
      emit('saved')
      emit('back')
    }).finally(() => {
      updateLoading.value = false
    })
  })
}

function firstDevice() {
  return Array.isArray(form.device) && form.device.length ? form.device[0] : null
}

function refreshImage() {
  const device = firstDevice()
  if (!device) {
    ElMessage.warning('缺少设备信息')
    return
  }
  getDeviceSnap({
    deviceId: device.deviceId,
    channelId: device.channelId
  }).then((url) => {
    bgImage.url = url || ''
    bgImage.realUrl = url || ''
    ElMessage.success('操作成功')
  })
}

function saveCurrentSnapshot() {
  const device = firstDevice()
  if (!device) {
    ElMessage.warning('缺少设备信息')
    return
  }
  snapshotLoading.value = true
  saveSnapshot({
    deviceId: device.deviceId,
    channelId: device.channelId
  }).then(() => {
    ElMessage.success('操作成功')
  }).finally(() => {
    snapshotLoading.value = false
  })
}

getDetail()
</script>

