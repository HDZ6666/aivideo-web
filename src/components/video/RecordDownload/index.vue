<template>
  <el-dialog v-model="open" title="录像下载" width="520px" append-to-body @closed="stopPolling">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="设备编号">{{ deviceId }}</el-descriptions-item>
      <el-descriptions-item label="通道编号">{{ channelId }}</el-descriptions-item>
      <el-descriptions-item label="流媒体">{{ mediaServerId }}</el-descriptions-item>
      <el-descriptions-item label="应用 / 流">{{ app }} / {{ stream }}</el-descriptions-item>
    </el-descriptions>
    <el-progress class="download-progress" :percentage="progress" :status="progress >= 100 ? 'success' : undefined" />
    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button type="danger" plain @click="stopDownload">停止下载</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const open = ref(false)
const deviceId = ref('')
const channelId = ref('')
const app = ref('')
const stream = ref('')
const mediaServerId = ref('')
const progress = ref(0)
const timer = ref(null)

function openDialog(currentDeviceId, currentChannelId, currentApp, currentStream, currentMediaServerId) {
  deviceId.value = currentDeviceId
  channelId.value = currentChannelId
  app.value = currentApp
  stream.value = currentStream
  mediaServerId.value = currentMediaServerId
  progress.value = 0
  open.value = true
  startPolling()
}

function startPolling() {
  stopPolling()
  queryProgress()
  timer.value = window.setInterval(queryProgress, 1000)
}

function stopPolling() {
  if (timer.value) {
    window.clearInterval(timer.value)
    timer.value = null
  }
}

function queryProgress() {
  if (!deviceId.value || !channelId.value || !stream.value) return
  request({
    method: 'get',
    url: `/api/gb_record/download/progress/${deviceId.value}/${channelId.value}/${stream.value}`
  }).then((res) => {
    const data = res.data || {}
    const value = Number(data.percentage ?? data.progress ?? data)
    if (!Number.isNaN(value)) {
      progress.value = value > 1 ? Number(value.toFixed(1)) : Number((value * 100).toFixed(1))
    }
    if (progress.value >= 100) {
      stopPolling()
    }
  })
}

function stopDownload() {
  if (!deviceId.value || !channelId.value || !stream.value) return
  request({
    method: 'get',
    url: `/api/gb_record/download/stop/${deviceId.value}/${channelId.value}/${stream.value}`
  }).then(() => {
    ElMessage.success('已停止下载')
    close()
  })
}

function close() {
  open.value = false
}

defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.download-progress {
  margin-top: 20px;
}
</style>
