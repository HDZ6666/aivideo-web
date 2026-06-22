<template>
  <el-dialog
    v-model="showDialog"
    width="240px"
    top="13%"
    append-to-body
    :close-on-click-modal="false"
    destroy-on-close
    align-center
    class="sync-channel-progress-dialog"
    @close="close"
  >
    <div class="sync-channel-progress">
      <el-progress type="circle" :percentage="percentage" :status="syncStatus" />
      <div class="sync-channel-progress__msg">{{ msg }}</div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import request from '@/utils/video/request'

const syncStatus = ref(null)
const percentage = ref(0)
const total = ref(0)
const current = ref(0)
const showDialog = ref(false)
const syncFlag = ref(false)
const deviceId = ref(null)
const timer = ref(null)
const waitCount = ref(0)
const msg = ref('正在同步')

const MAX_WAIT_COUNT = 20

function openDialog(value) {
  deviceId.value = value
  showDialog.value = true
  msg.value = ''
  percentage.value = 0
  total.value = 0
  current.value = 0
  syncFlag.value = false
  syncStatus.value = null
  waitCount.value = 0
  getProgress()
}

function getProgress() {
  request({
    method: 'get',
    url: `/api/device/query/${deviceId.value}/sync_status/`
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        if (res.data != null) {
          if (res.data.syncIng) {
            if (!syncFlag.value) syncFlag.value = true
            if (Number(res.data.total) === 0) {
              msg.value = '等待同步中'
              timer.value = window.setTimeout(getProgress, 300)
            } else {
              total.value = res.data.total
              current.value = res.data.current
              percentage.value = Math.floor((Number(res.data.current) / Number(res.data.total)) * 10000) / 100
              msg.value = `同步中...[${res.data.current}/${res.data.total}]`
              timer.value = window.setTimeout(getProgress, 300)
            }
          } else if (res.data.errorMsg) {
            handleWaitingOrError(res.data.errorMsg)
          } else {
            syncStatus.value = 'success'
            percentage.value = 100
            msg.value = '同步成功'
            timer.value = window.setTimeout(() => {
              showDialog.value = false
            }, 3000)
          }
        } else {
          handleWaitingOrError(res.msg || '同步状态等待中')
        }
      } else if (syncFlag.value) {
        syncStatus.value = 'success'
        percentage.value = 100
        msg.value = '同步成功'
      } else {
        handleWaitingOrError(res.msg)
      }
    })
    .catch((error) => {
      console.error(error)
      syncStatus.value = 'exception'
      msg.value = error?.response?.data?.msg || error.message || '同步状态查询失败'
    })
}

function handleWaitingOrError(message) {
  const text = message || '同步状态等待中'
  if (String(text).includes('尚未开始') && waitCount.value < MAX_WAIT_COUNT) {
    waitCount.value += 1
    msg.value = '等待同步中'
    timer.value = window.setTimeout(getProgress, 300)
    return
  }

  syncStatus.value = 'exception'
  msg.value = text
}

function close() {
  window.clearTimeout(timer.value)
}

onBeforeUnmount(() => {
  close()
})

defineExpose({
  openDialog
})
</script>

<style scoped>
.sync-channel-progress {
  text-align: center;
}

.sync-channel-progress__msg {
  margin-top: 12px;
  text-align: center;
}
</style>
