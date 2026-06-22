<template>
  <el-dialog
    v-model="open"
    title="ONVIF 搜索"
    width="560px"
    top="2rem"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="reset"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="地址" prop="hostName">
        <el-select v-model="form.hostName" placeholder="请选择 ONVIF 地址" style="width: 100%">
          <el-option
            v-for="item in hostNames"
            :key="item"
            :label="item.replace('http://', '')"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" clearable show-password />
      </el-form-item>
    </el-form>

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

const open = ref(false)
const loading = ref(false)
const formRef = ref(null)
const hostNames = ref([])
const callbackRef = ref(null)
const form = reactive({
  hostName: null,
  username: 'admin',
  password: 'admin123'
})
const rules = {
  hostName: [{ required: true, message: '请选择地址', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

function openDialog(list, callback) {
  hostNames.value = list || []
  form.hostName = hostNames.value[0] || null
  callbackRef.value = callback
  open.value = true
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return

    loading.value = true
    request({
      method: 'get',
      url: '/api/onvif/rtsp',
      params: {
        hostname: form.hostName,
        timeout: 3000,
        username: form.username,
        password: form.password
      }
    })
      .then((res) => {
        if (res.data) {
          callbackRef.value?.(res.data)
          close()
        } else {
          ElMessage.error(res.msg || '未获取到 RTSP 地址')
        }
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
  hostNames.value = []
  callbackRef.value = null
  form.hostName = null
  form.username = 'admin'
  form.password = 'admin123'
}

defineExpose({
  openDialog,
  close
})
</script>
