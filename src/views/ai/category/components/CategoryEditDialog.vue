<template>
  <el-dialog v-model="visible" :title="title" width="520px" destroy-on-close @open="handleOpen">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="算法名称" prop="alarmTypeName">
        <el-input v-model="form.alarmTypeName" placeholder="请输入算法名称" />
      </el-form-item>
      <el-form-item label="唯一识别码" prop="alarmCode">
        <el-input v-model="form.alarmCode" placeholder="请输入唯一识别码" />
      </el-form-item>
      <el-form-item v-if="showStatus" label="状态">
        <el-switch v-model="form.isUse" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { cloneJson } from '../../utils'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '算法'
  },
  data: {
    type: Object,
    default: () => ({})
  },
  loading: Boolean,
  showStatus: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
const formRef = ref()
const form = reactive({
  id: undefined,
  alarmTypeName: '',
  alarmCode: '',
  isUse: 0,
  fileId: 0
})

const rules = {
  alarmTypeName: [{ required: true, message: '请输入算法名称', trigger: 'blur' }],
  alarmCode: [{ required: true, message: '请输入唯一识别码', trigger: 'blur' }]
}

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value) => {
  emit('update:modelValue', value)
})

function handleOpen() {
  Object.assign(form, {
    id: props.data.id,
    alarmTypeName: props.data.alarmTypeName || '',
    alarmCode: props.data.alarmCode || '',
    isUse: props.data.isUse || 0,
    fileId: props.data.fileId || 0
  })
}

function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (form.isUse === 1 && !form.fileId) {
      ElMessage.warning('请先绑定源文件再启用算法')
      return
    }
    emit('submit', cloneJson(form))
  })
}
</script>

