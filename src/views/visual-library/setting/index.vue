<template>
  <div class="app-container visual-setting-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ config.title }}</span>
          <el-button icon="Refresh" @click="loadForm">刷新</el-button>
        </div>
      </template>
      <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" label-width="150px" class="setting-form">
        <el-form-item v-for="field in config.fields" :key="field.prop" :label="field.label" :prop="field.prop">
          <component
            :is="fieldComponent(field)"
            v-model="form[field.prop]"
            v-bind="fieldProps(field)"
            :disabled="field.disabled"
            clearable
            filterable
          >
            <el-option
              v-for="option in field.options || []"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </component>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSelfInstance, getSetting, saveSetting, updateSelfInstance } from '@/api/visual-library'
import { settingConfigs } from '../configs'

const route = useRoute()
const configKey = computed(() => route.meta.settingKey)
const config = computed(() => settingConfigs[configKey.value] || { fields: [] })
const form = reactive({})
const formRef = ref(null)
const loading = ref(false)
const submitLoading = ref(false)

const rules = computed(() => {
  const result = {}
  config.value.fields.forEach((field) => {
    if (field.required) {
      result[field.prop] = [{ required: true, message: `请输入${field.label}`, trigger: 'blur' }]
    }
  })
  return result
})

watch(configKey, loadForm)
onMounted(loadForm)

function fieldComponent(field) {
  if (field.type === 'select') return 'el-select'
  if (field.type === 'switch') return 'el-switch'
  if (field.type === 'number') return 'el-input-number'
  if (field.type === 'password') return 'el-input'
  return 'el-input'
}

function fieldProps(field) {
  if (field.type === 'number') return { controlsPosition: 'right', placeholder: `请输入${field.label}` }
  if (field.type === 'password') return { type: 'password', showPassword: true, placeholder: `请输入${field.label}` }
  return { placeholder: `请输入${field.label}` }
}

async function loadForm() {
  loading.value = true
  try {
    Object.keys(form).forEach((key) => delete form[key])
    const response = config.value.mode === 'selfInstance' ? await getSelfInstance() : await getSetting()
    Object.assign(form, response?.data || response || {})
  } finally {
    loading.value = false
  }
}

function submitForm() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      if (config.value.mode === 'selfInstance') {
        await updateSelfInstance(form)
      } else {
        await saveSetting(form)
      }
      ElMessage.success('保存成功')
      loadForm()
    } finally {
      submitLoading.value = false
    }
  })
}
</script>

<style scoped>
.visual-setting-page {
  max-width: 920px;
}

.card-header,
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-form :deep(.el-input),
.setting-form :deep(.el-select),
.setting-form :deep(.el-input-number) {
  width: 420px;
}

.form-footer {
  justify-content: flex-end;
  padding-top: 8px;
}
</style>
