<template>
  <el-dialog v-model="open" title="媒体节点" width="920px" append-to-body destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="IP" prop="ip">
            <el-input v-model="form.ip" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="HTTP端口" prop="httpPort">
            <el-input v-model="form.httpPort" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="SECRET" prop="secret">
            <el-input v-model="form.secret" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="HOOK IP">
            <el-input v-model="form.hookIp" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="SDP IP">
            <el-input v-model="form.sdpIp" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="流IP">
            <el-input v-model="form.streamIp" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="HTTPS端口">
            <el-input v-model="form.httpSSlPort" :disabled="form.defaultServer" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="RTSP端口">
            <el-input v-model="form.rtspPort" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="RTSPS端口">
            <el-input v-model="form.rtspSSLPort" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="RTMP端口">
            <el-input v-model="form.rtmpPort" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="RTMPS端口">
            <el-input v-model="form.rtmpSSlPort" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="自动配置">
            <el-switch v-model="form.autoConfig" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="收流端口模式">
            <el-switch v-model="form.rtpEnable" active-text="多端口" inactive-text="单端口" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item v-if="!form.rtpEnable" label="收流端口">
            <el-input v-model="form.rtpProxyPort" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item v-else label="收流端口范围">
            <el-input v-model="rtpPortRange1" style="width: 120px" :disabled="form.defaultServer" />
            <span class="range-separator">-</span>
            <el-input v-model="rtpPortRange2" style="width: 120px" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item v-if="form.sendRtpEnable" label="发流端口范围">
            <el-input v-model="sendRtpPortRange1" style="width: 120px" :disabled="form.defaultServer" />
            <span class="range-separator">-</span>
            <el-input v-model="sendRtpPortRange2" style="width: 120px" :disabled="form.defaultServer" />
          </el-form-item>
          <el-form-item label="录像服务端口">
            <el-input v-model="form.recordAssistPort" :disabled="form.defaultServer">
              <template #append>
                <el-button icon="Check" @click="checkRecordServer" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">{{ form.defaultServer ? '关闭' : '取消' }}</el-button>
      <el-button v-if="!form.defaultServer" type="primary" plain :loading="checkLoading" @click="checkServer">测试</el-button>
      <el-button v-if="!form.defaultServer" type="primary" :loading="loading" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const open = ref(false)
const loading = ref(false)
const checkLoading = ref(false)
const formRef = ref(null)
const callbackRef = ref(null)
const rtpPortRange1 = ref('30000')
const rtpPortRange2 = ref('30500')
const sendRtpPortRange1 = ref('50000')
const sendRtpPortRange2 = ref('60000')
const form = reactive(createForm())
const rules = {
  ip: [{ required: true, message: '请输入IP', trigger: 'blur' }],
  httpPort: [{ required: true, message: '请输入HTTP端口', trigger: 'blur' }],
  secret: [{ required: true, message: '请输入SECRET', trigger: 'blur' }]
}

function createForm() {
  return {
    id: '',
    ip: '',
    autoConfig: true,
    hookIp: '',
    sdpIp: '',
    streamIp: '',
    secret: '035c73f7-bb6b-4889-a715-d9eb2d1925cc',
    httpPort: '',
    httpSSlPort: '',
    recordAssistPort: '',
    rtmpPort: '',
    rtmpSSlPort: '',
    rtpEnable: false,
    rtpPortRange: '',
    sendRtpEnable: false,
    sendRtpPortRange: '',
    rtpProxyPort: '',
    rtspPort: '',
    rtspSSLPort: '',
    defaultServer: false
  }
}

function openDialog(row, callback) {
  Object.assign(form, createForm(), row || {})
  if (form.rtpPortRange) {
    const ranges = form.rtpPortRange.split(',')
    rtpPortRange1.value = ranges[0] || rtpPortRange1.value
    rtpPortRange2.value = ranges[1] || rtpPortRange2.value
  }
  if (form.sendRtpPortRange) {
    const ranges = form.sendRtpPortRange.split(',')
    sendRtpPortRange1.value = ranges[0] || sendRtpPortRange1.value
    sendRtpPortRange2.value = ranges[1] || sendRtpPortRange2.value
  }
  callbackRef.value = callback
  open.value = true
}

function checkServer() {
  checkLoading.value = true
  request({
    method: 'get',
    url: '/api/server/media_server/check',
    params: {
      ip: form.ip,
      port: form.httpPort,
      secret: form.secret
    }
  })
    .then((res) => {
      Object.assign(form, res.data || {})
      applyPortRanges()
      ElMessage.success('测试成功')
    })
    .finally(() => {
      checkLoading.value = false
    })
}

function checkRecordServer() {
  request({
    method: 'get',
    url: '/api/server/media_server/record/check',
    params: {
      ip: form.ip,
      port: form.recordAssistPort
    }
  }).then(() => {
    ElMessage.success('录像管理服务可用')
  })
}

function submit() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (form.rtpEnable) {
      form.rtpPortRange = `${rtpPortRange1.value},${rtpPortRange2.value}`
    }
    if (form.sendRtpEnable) {
      form.sendRtpPortRange = `${sendRtpPortRange1.value},${sendRtpPortRange2.value}`
    }
    loading.value = true
    request({
      method: 'post',
      url: '/api/server/media_server/save',
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
  Object.assign(form, createForm())
  rtpPortRange1.value = '30000'
  rtpPortRange2.value = '30500'
  sendRtpPortRange1.value = '50000'
  sendRtpPortRange2.value = '60000'
}

function applyPortRanges() {
  if (form.rtpPortRange) {
    const ranges = form.rtpPortRange.split(',')
    rtpPortRange1.value = ranges[0] || rtpPortRange1.value
    rtpPortRange2.value = ranges[1] || rtpPortRange2.value
  }
  if (form.sendRtpPortRange) {
    const ranges = form.sendRtpPortRange.split(',')
    sendRtpPortRange1.value = ranges[0] || sendRtpPortRange1.value
    sendRtpPortRange2.value = ranges[1] || sendRtpPortRange2.value
  }
}

defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.range-separator {
  margin: 0 8px;
}
</style>
