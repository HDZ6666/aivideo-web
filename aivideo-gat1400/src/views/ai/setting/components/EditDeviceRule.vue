<template>
  <el-card shadow="never" header="告警批量设置">
    <el-radio-group v-model="activeTab" class="mb12">
      <el-radio-button label="area">区域设置</el-radio-button>
      <el-radio-button label="base">基础设置</el-radio-button>
    </el-radio-group>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" v-loading="loading">
      <div v-show="activeTab === 'area'">
        <el-form-item label="" prop="areaSet">
          <AreaCanvas v-model="form.areaSet" :bg-image="{}" mtype="all" />
        </el-form-item>
      </div>
      <div v-show="activeTab === 'base'">
        <BaseRuleForm
          :form="form"
          :alarm-type-id="alarmTypeId"
          :select-deviceable="false"
          :frame-set-able="false"
        />
      </div>
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
import { updateDeviceRules } from '@/api/ai/rule'
import { DEFAULT_AREA_SET, defaultTimelines } from '../../utils'
import AreaCanvas from './AreaCanvas.vue'
import BaseRuleForm from './BaseRuleForm.vue'

const props = defineProps({
  alarmTypeId: {
    type: [String, Number],
    required: true
  },
  selectedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['back', 'saved'])

const activeTab = ref('area')
const formRef = ref()
const loading = ref(false)
const form = reactive(createForm())

const rules = {
  device: [{ required: true, type: 'array', min: 1, message: '请选择设备', trigger: 'change' }]
}

function createForm() {
  return {
    engine: '0',
    device: props.selectedRows.reduce((list, row) => list.concat(row.device || []), []),
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
    const ruleIds = props.selectedRows.map((item) => item.id)
    loading.value = true
    updateDeviceRules({
      ...form,
      alarmTypeId: String(props.alarmTypeId),
      ruleIds
    }).then(() => {
      ElMessage.success('操作成功')
      emit('saved')
      emit('back')
    }).finally(() => {
      loading.value = false
    })
  })
}
</script>

