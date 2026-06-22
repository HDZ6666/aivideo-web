<template>
  <el-dialog v-model="open" title="上级平台" width="980px" append-to-body destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="150px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="SIP服务国标编码" prop="serverGBId">
            <el-input v-model="form.serverGBId" clearable @input="serverGBIdChange" />
          </el-form-item>
          <el-form-item label="SIP服务国标域" prop="serverGBDomain">
            <el-input v-model="form.serverGBDomain" clearable />
          </el-form-item>
          <el-form-item label="SIP服务IP" prop="serverIP">
            <el-input v-model="form.serverIP" clearable />
          </el-form-item>
          <el-form-item label="SIP服务端口" prop="serverPort">
            <el-input v-model="form.serverPort" clearable />
          </el-form-item>
          <el-form-item label="设备国标编码" prop="deviceGBId">
            <el-input v-model="form.deviceGBId" clearable @input="deviceGBIdChange" />
          </el-form-item>
          <el-form-item label="本地IP">
            <el-input v-model="form.deviceIp" disabled />
          </el-form-item>
          <el-form-item label="本地端口">
            <el-input v-model="form.devicePort" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认证用户名">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="行政区划">
            <el-input v-model="form.administrativeDivision" clearable />
          </el-form-item>
          <el-form-item label="认证密码">
            <el-input v-model="form.password" />
          </el-form-item>
          <el-form-item label="注册周期(秒)" prop="expires">
            <el-input v-model="form.expires" />
          </el-form-item>
          <el-form-item label="心跳周期(秒)" prop="keepTimeout">
            <el-input v-model="form.keepTimeout" />
          </el-form-item>
          <el-form-item label="信令传输" prop="transport">
            <el-select v-model="form.transport" style="width: 100%">
              <el-option label="UDP" value="UDP" />
              <el-option label="TCP" value="TCP" />
            </el-select>
          </el-form-item>
          <el-form-item label="目录分组">
            <el-select v-model="form.catalogGroup" style="width: 100%">
              <el-option label="1" :value="1" />
              <el-option label="2" :value="2" />
              <el-option label="4" :value="4" />
              <el-option label="8" :value="8" />
            </el-select>
          </el-form-item>
          <el-form-item label="字符集" prop="characterSet">
            <el-select v-model="form.characterSet" style="width: 100%">
              <el-option label="GB2312" value="GB2312" />
              <el-option label="UTF-8" value="UTF-8" />
            </el-select>
          </el-form-item>
          <el-form-item label="其他选项">
            <el-checkbox v-model="form.enable" @change="checkExpires">启用</el-checkbox>
            <el-checkbox v-model="form.startOfflinePush">拉起推流</el-checkbox>
            <el-checkbox v-model="form.rtcp" @change="rtcpCheckBoxChange">RTCP保活</el-checkbox>
            <el-checkbox v-model="form.asMessageChannel">消息通道</el-checkbox>
            <el-checkbox v-model="form.autoPushChannel">推送通道</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">{{ submitText }}</el-button>
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
const callbackRef = ref(null)
const originalDeviceGBId = ref('')
const submitText = ref('立即创建')
const saveUrl = ref('/api/platform/add')
const form = reactive(createForm())
const deviceGBIdValidator = async (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入设备国标编码'))
    return
  }
  if (value === originalDeviceGBId.value) {
    callback()
    return
  }
  try {
    const exists = await deviceGBIdExit(value)
    if (exists) {
      callback(new Error('设备国标编码已存在'))
    } else {
      callback()
    }
  } catch (error) {
    callback(new Error('设备国标编码校验失败'))
  }
}
const rules = {
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  serverGBId: [{ required: true, message: '请输入SIP服务国标编码', trigger: 'blur' }],
  serverGBDomain: [{ required: true, message: '请输入SIP服务国标域', trigger: 'blur' }],
  serverIP: [{ required: true, message: '请输入SIP服务IP', trigger: 'blur' }],
  serverPort: [{ required: true, message: '请输入SIP服务端口', trigger: 'blur' }],
  deviceGBId: [{ validator: deviceGBIdValidator, trigger: 'blur' }],
  expires: [{ required: true, message: '请输入注册周期', trigger: 'blur' }],
  keepTimeout: [{ required: true, message: '请输入心跳周期', trigger: 'blur' }],
  transport: [{ required: true, message: '请选择信令传输', trigger: 'change' }],
  characterSet: [{ required: true, message: '请选择字符集', trigger: 'change' }]
}

function createForm() {
  return {
    id: null,
    enable: true,
    ptz: true,
    rtcp: false,
    asMessageChannel: false,
    autoPushChannel: false,
    name: '',
    serverGBId: '',
    serverGBDomain: '',
    serverIP: '',
    serverPort: '',
    deviceGBId: '',
    deviceIp: '',
    devicePort: '',
    username: '',
    password: '',
    expires: 3600,
    keepTimeout: 60,
    transport: 'UDP',
    characterSet: 'GB2312',
    startOfflinePush: false,
    catalogGroup: 1,
    administrativeDivision: ''
  }
}

function openDialog(row, callback) {
  Object.assign(form, createForm(), row || {})
  originalDeviceGBId.value = row?.deviceGBId || ''
  callbackRef.value = callback
  if (row) {
    submitText.value = '保存'
    saveUrl.value = '/api/platform/save'
  } else {
    submitText.value = '立即创建'
    saveUrl.value = '/api/platform/add'
    getServerConfig()
  }
  open.value = true
}

async function deviceGBIdExit(deviceGbId) {
  const res = await request({
    method: 'get',
    url: `/api/platform/exit/${deviceGbId}`
  })
  return res === true || res === 'true' || res.data === true || res.data === 'true'
}

function getServerConfig() {
  request({ method: 'get', url: '/api/platform/server_config' }).then((res) => {
    const data = res.data || {}
    form.deviceGBId = data.username
    form.deviceIp = data.deviceIp
    form.devicePort = data.devicePort
    form.username = data.username
    form.password = data.password
    form.administrativeDivision = data.username?.substring(0, 6) || ''
  })
}

function serverGBIdChange() {
  if (form.serverGBId?.length > 10) {
    form.serverGBDomain = form.serverGBId.substring(0, 10)
  }
}

function deviceGBIdChange() {
  form.username = form.deviceGBId
  if (!form.administrativeDivision) {
    form.administrativeDivision = form.deviceGBId?.substring(0, 6) || ''
  }
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    loading.value = true
    request({
      method: 'post',
      url: saveUrl.value,
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

function checkExpires() {
  if (form.enable && String(form.expires) === '0') {
    form.expires = 3600
  }
}

function rtcpCheckBoxChange(value) {
  if (value) {
    ElMessage.warning('开启RTCP保活需要上级平台支持')
  }
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
