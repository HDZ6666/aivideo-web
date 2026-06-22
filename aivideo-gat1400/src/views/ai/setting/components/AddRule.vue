<template>
  <el-card shadow="never" header="告警规则新增">
    <el-radio-group v-model="activeTab" class="mb12">
      <el-radio-button label="base">基础设置</el-radio-button>
    </el-radio-group>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" v-loading="loading">
      <BaseRuleForm :form="form" :alarm-type-id="alarmTypeId" :frame-set-able="false" />
      <el-form-item>
        <el-button @click="$emit('back')">返回</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addRule } from '@/api/ai/rule'
import { DEFAULT_AREA_SET, defaultTimelines } from '../../utils'
import BaseRuleForm from './BaseRuleForm.vue'

const props = defineProps({
  alarmTypeId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['back', 'saved'])

const activeTab = ref('base')
const formRef = ref()
const loading = ref(false)
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
    isCompare: 0,
    compareMinSize: 0,
    compareMaxSize: 100,
    comparePicture: '',
    trackingEnabled: 1,
    trackingDuration: 0
  }
}

function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return
    loading.value = true
    addRule({
      ...form,
      alarmTypeId: String(props.alarmTypeId)
    }).then(() => {
      ElMessage.success('添加规则成功')
      emit('saved')
      emit('back')
    }).finally(() => {
      loading.value = false
    })
  })
}
</script>

