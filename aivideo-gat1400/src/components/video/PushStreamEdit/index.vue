<template>
  <el-dialog v-model="open" :title="edit ? '加入国标' : '添加通道'" width="560px" append-to-body destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="流应用名" prop="app">
        <el-input v-model="form.app" clearable :disabled="edit" />
      </el-form-item>
      <el-form-item label="流ID" prop="stream">
        <el-input v-model="form.stream" clearable :disabled="edit" />
      </el-form-item>
      <el-form-item label="国标编码" prop="gbId">
        <el-input v-model="form.gbId" placeholder="设置国标编码可推送到国标" clearable />
      </el-form-item>
      <el-form-item v-if="form.gbId" label="经度" prop="longitude">
        <el-input v-model="form.longitude" clearable />
      </el-form-item>
      <el-form-item v-if="form.gbId" label="纬度" prop="latitude">
        <el-input v-model="form.latitude" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const open = ref(false)
const edit = ref(false)
const loading = ref(false)
const formRef = ref(null)
const callbackRef = ref(null)
const form = reactive(createForm())
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  app: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
  stream: [{ required: true, message: '请输入流ID', trigger: 'blur' }],
  gbId: [{ required: true, message: '请输入国标编码', trigger: 'blur' }]
}

function createForm() {
  return {
    name: '',
    app: '',
    stream: '',
    mediaServerId: '',
    gbId: '',
    longitude: '',
    latitude: ''
  }
}

function openDialog(row, callback) {
  Object.assign(form, createForm(), row || {})
  edit.value = !!row
  callbackRef.value = callback
  open.value = true
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    loading.value = true
    request({
      method: 'post',
      url: edit.value ? '/api/push/save_to_gb' : '/api/push/add',
      data: { ...form }
    })
      .then(() => {
        ElMessage.success('保存成功')
        callbackRef.value?.()
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
  Object.assign(form, createForm())
}

defineExpose({
  openDialog,
  close
})
</script>
