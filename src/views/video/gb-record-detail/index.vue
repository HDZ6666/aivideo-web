<template>
  <div class="app-container video-gb-record-detail-page">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="Back" plain @click="goBack">返回</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-date-picker
          v-model="chooseDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="日期"
          style="width: 180px"
          @change="dateChange"
        />
      </el-col>
      <el-col :span="1.5">
        <el-tag type="info">{{ deviceId || '-' }} / {{ channelId || '-' }}</el-tag>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="dateChange"></right-toolbar>
    </el-row>

    <div class="record-layout">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme record-splitpanes">
        <pane size="22" min-size="16">
          <div class="record-list-panel" v-loading="recordsLoading">
            <div class="record-list-header">
              <div class="record-list-title">
                <el-icon><VideoCamera /></el-icon>
                <span>片段列表</span>
              </div>
              <el-tag size="small" type="info">{{ detailFiles.length }}</el-tag>
            </div>
            <div class="record-list-body">
              <el-empty v-if="detailFiles.length === 0" description="暂无数据" />
              <el-scrollbar v-else height="100%">
                <div
                  v-for="item in detailFiles"
                  :key="item.filePath || `${item.startTime}-${item.endTime}`"
                  class="record-file-item"
                  :class="{ 'is-active': chooseFile === item }"
                  @click="checkedFile(item)"
                >
                  <el-icon class="record-file-icon"><VideoCamera /></el-icon>
                  <div class="record-file-main">
                    <span class="record-file-time">{{ formatRange(item) }}</span>
                    <span class="record-file-duration">{{ getDurationText(item) }}</span>
                  </div>
                  <el-button
                    class="record-file-download"
                    link
                    type="primary"
                    icon="Download"
                    title="下载"
                    @click.stop="downloadRecord(item)"
                  />
                </div>
              </el-scrollbar>
            </div>
          </div>
        </pane>
        <pane size="78" min-size="50">
          <div class="record-content-panel">
            <div class="gb-record-player">
              <StreamPlayer ref="recordVideoPlayerRef" :url="videoUrl" @clear="clearPlayer" />
            </div>
            <div class="gb-record-options">
              <div class="gb-record-controlbar">
                <el-time-picker
                  v-model="timeRange"
                  is-range
                  value-format="HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  class="record-time-range"
                  @change="timePickerChange"
                />

                <el-button-group class="record-action-group">
                  <el-button icon="VideoPause" title="暂停" @click="gbPause" />
                  <el-button icon="VideoPlay" title="播放" @click="gbPlay" />
                  <el-button icon="Download" title="下载选定录像" :disabled="!playTime" @click="downloadRecord()" />
                  <el-button
                    icon="Operation"
                    :title="sliderMin === 0 && sliderMax === 86400 ? '放大滑块' : '恢复滑块'"
                    @click="setSliderFit"
                  />
                  <el-dropdown @command="gbScale">
                    <el-button title="播放倍速">
                      倍速<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="0.25">0.25倍速</el-dropdown-item>
                        <el-dropdown-item command="0.5">0.5倍速</el-dropdown-item>
                        <el-dropdown-item command="1.0">1倍速</el-dropdown-item>
                        <el-dropdown-item command="2.0">2倍速</el-dropdown-item>
                        <el-dropdown-item command="4.0">4倍速</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-button-group>
              </div>

              <div ref="timelineRef" class="record-timeline">
                <el-slider
                  v-model="playTime"
                  class="playtime-slider"
                  :disabled="detailFiles.length === 0"
                  :min="sliderMin"
                  :max="sliderMax"
                  range
                  :format-tooltip="playTimeFormat"
                  :marks="playTimeSliderMarks"
                  @change="playTimeChange"
                />
                <div class="slider-val-box">
                  <div
                    v-for="(item, index) in detailFiles"
                    :key="index"
                    class="slider-val"
                    :style="{ width: `${getDataWidth(item)}%`, left: `${getDataLeft(item)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </pane>
      </splitpanes>
    </div>

    <RecordDownload ref="recordDownloadRef" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { ArrowDown, VideoCamera } from '@element-plus/icons-vue'
import useAppStore from '@/store/modules/app'
import request from '@/utils/video/request'
import { pickPlayStartUrl } from '@/utils/video/stream'
import StreamPlayer from '@/components/video/StreamPlayer/index.vue'
import RecordDownload from '@/components/video/RecordDownload/index.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const recordVideoPlayerRef = ref(null)
const recordDownloadRef = ref(null)
const timelineRef = ref(null)
const deviceId = ref('')
const channelId = ref('')
const recordsLoading = ref(false)
const streamId = ref('')
const detailFiles = ref([])
const chooseDate = ref('')
const videoUrl = ref('')
const chooseFile = ref(null)
const streamInfo = ref(null)
const app = ref('')
const mediaServerId = ref('')
const sliderMin = ref(0)
const sliderMax = ref(86400)
const playTime = ref([0, 86400])
const timeRange = ref([])
const startTime = ref('')
const endTime = ref('')
const timelineWidth = ref(0)
const playTimeSliderMarks = computed(() => buildPlayTimeSliderMarks(timelineWidth.value, sliderMin.value, sliderMax.value))
let timelineResizeObserver = null

onMounted(() => {
  deviceId.value = route.query.deviceId || ''
  channelId.value = route.query.channelId || ''
  chooseDate.value = formatDay(new Date())
  dateChange()
  initTimelineObserver()
  window.addEventListener('beforeunload', stopPlayRecord)
})

onBeforeUnmount(() => {
  stopPlayRecord()
  if (timelineResizeObserver) {
    timelineResizeObserver.disconnect()
    timelineResizeObserver = null
  }
  window.removeEventListener('resize', updateTimelineWidth)
  window.removeEventListener('beforeunload', stopPlayRecord)
})

function initTimelineObserver() {
  nextTick(() => {
    updateTimelineWidth()
    if (window.ResizeObserver && timelineRef.value) {
      timelineResizeObserver = new ResizeObserver(updateTimelineWidth)
      timelineResizeObserver.observe(timelineRef.value)
    } else {
      window.addEventListener('resize', updateTimelineWidth)
    }
  })
}

function updateTimelineWidth() {
  timelineWidth.value = timelineRef.value?.clientWidth || 0
}

function buildPlayTimeSliderMarks(width, min, max) {
  const safeMin = Number(min) || 0
  const safeMax = Number(max) || 86400
  const range = Math.max(safeMax - safeMin, 1)
  const maxLabelCount = Math.max(2, Math.floor((width || 360) / 64))
  const steps = [900, 1800, 3600, 7200, 10800, 14400, 21600, 28800, 43200, 86400]
  const step = steps.find((item) => getMarkCount(safeMin, safeMax, item) <= maxLabelCount) || steps[steps.length - 1]
  const marks = {
    [safeMin]: playTimeFormat(safeMin)
  }
  const firstMark = Math.ceil(safeMin / step) * step

  for (let current = firstMark; current < safeMax; current += step) {
    if (current > safeMin) {
      marks[current] = playTimeFormat(current)
    }
  }

  marks[safeMax] = playTimeFormat(safeMax)
  return marks
}

function getMarkCount(min, max, step) {
  let count = 2
  const firstMark = Math.ceil(min / step) * step
  for (let current = firstMark; current < max; current += step) {
    if (current > min) count += 1
  }
  return count
}

function dateChange() {
  if (!chooseDate.value || !deviceId.value || !channelId.value) return
  setTime(`${chooseDate.value} 00:00:00`, `${chooseDate.value} 23:59:59`)
  recordsLoading.value = true
  detailFiles.value = []
  request({
    method: 'get',
    url: `/api/gb_record/query/${deviceId.value}/${channelId.value}`,
    params: {
      startTime: startTime.value,
      endTime: endTime.value
    }
  })
    .then((res) => {
      detailFiles.value = res.data?.recordList || []
    })
    .finally(() => {
      recordsLoading.value = false
    })
}

function setTime(start, end) {
  startTime.value = start
  endTime.value = end
  const dayStart = new Date(`${chooseDate.value} 00:00:00`).getTime()
  const startOffset = (new Date(start).getTime() - dayStart) / 1000
  const endOffset = (new Date(end).getTime() - dayStart) / 1000
  playTime.value = [startOffset, endOffset]
  timeRange.value = [formatTime(new Date(start)), formatTime(new Date(end))]
}

function checkedFile(file) {
  chooseFile.value = file
  setTime(file.startTime, file.endTime)
  playRecord()
}

async function playRecord() {
  if (streamId.value) {
    await stopPlayRecord()
  }
  const res = await request({
    method: 'get',
    url: `/api/playback/start/${deviceId.value}/${channelId.value}`,
    params: {
      startTime: startTime.value,
      endTime: endTime.value
    }
  })
  streamInfo.value = res.data
  app.value = streamInfo.value?.app || ''
  streamId.value = streamInfo.value?.stream || ''
  mediaServerId.value = streamInfo.value?.mediaServerId || ''
  videoUrl.value = pickPlayStartUrl(streamInfo.value)
  if (!videoUrl.value) {
    ElMessage.error('接口未返回可用播放地址')
  }
}

function gbPlay() {
  if (!streamId.value) return
  request({
    method: 'get',
    url: `/api/playback/resume/${streamId.value}`
  }).then(() => {
    recordVideoPlayerRef.value?.play(videoUrl.value)
  })
}

function gbPause() {
  if (!streamId.value) return
  request({
    method: 'get',
    url: `/api/playback/pause/${streamId.value}`
  }).then(() => {
    recordVideoPlayerRef.value?.pause()
  })
}

function gbScale(command) {
  if (!streamId.value) return
  request({
    method: 'get',
    url: `/api/playback/speed/${streamId.value}/${command}`
  })
}

async function downloadRecord(row) {
  const currentRow = row || {
    startTime: formatDate(new Date(new Date(`${chooseDate.value} 00:00:00`).getTime() + playTime.value[0] * 1000)),
    endTime: formatDate(new Date(new Date(`${chooseDate.value} 00:00:00`).getTime() + playTime.value[1] * 1000))
  }
  if (streamId.value) {
    await stopPlayRecord()
  }
  const res = await request({
    method: 'get',
    url: `/api/gb_record/download/start/${deviceId.value}/${channelId.value}`,
    params: {
      startTime: currentRow.startTime,
      endTime: currentRow.endTime,
      downloadSpeed: 4
    }
  })
  const downloadInfo = res.data || {}
  recordDownloadRef.value?.openDialog(
    deviceId.value,
    channelId.value,
    downloadInfo.app,
    downloadInfo.stream,
    downloadInfo.mediaServerId
  )
}

function stopPlayRecord(callback) {
  if (!streamId.value) {
    callback?.()
    return Promise.resolve()
  }
  recordVideoPlayerRef.value?.pause()
  videoUrl.value = ''
  const currentStreamId = streamId.value
  streamId.value = ''
  return request({
    method: 'get',
    url: `/api/playback/stop/${deviceId.value}/${channelId.value}/${currentStreamId}`
  }).finally(() => {
    callback?.()
  })
}

function clearPlayer() {
  stopPlayRecord()
}

function getDataWidth(item) {
  const timeForFile = getTimeForFile(item)
  return (timeForFile[2] / ((sliderMax.value - sliderMin.value) * 1000)) * 100
}

function getDataLeft(item) {
  const timeForFile = getTimeForFile(item)
  const dayStart = new Date(`${chooseDate.value} 00:00:00`).getTime()
  const diff = timeForFile[0].getTime() - dayStart
  return ((diff - sliderMin.value * 1000) / ((sliderMax.value - sliderMin.value) * 1000)) * 100
}

function timePickerChange(value) {
  if (!value || value.length !== 2) return
  setTime(toDateTime(value[0]), toDateTime(value[1]))
}

function playTimeChange(value) {
  const start = formatDate(new Date(new Date(`${chooseDate.value} 00:00:00`).getTime() + value[0] * 1000))
  const end = formatDate(new Date(new Date(`${chooseDate.value} 00:00:00`).getTime() + value[1] * 1000))
  setTime(start, end)
  playRecord()
}

function setSliderFit() {
  if (sliderMin.value === 0 && sliderMax.value === 86400) {
    if (detailFiles.value.length === 0) return
    const firstTime = getTimeForFile(detailFiles.value[0])
    const lastTime = getTimeForFile(detailFiles.value[detailFiles.value.length - 1])
    const dayStart = new Date(`${chooseDate.value} 00:00:00`).getTime()
    const startOffset = firstTime[0].getTime() - dayStart
    const endOffset = lastTime[1].getTime() - dayStart
    sliderMin.value = Math.floor(startOffset / 1000 - (startOffset / 1000) % 3600)
    sliderMax.value = Math.floor(endOffset / 1000 - (endOffset / 1000) % 3600) + 3600
    playTime.value = [sliderMin.value, sliderMax.value]
  } else {
    sliderMin.value = 0
    sliderMax.value = 86400
  }
}

function getTimeForFile(file) {
  const start = new Date(file.startTime)
  const end = new Date(file.endTime)
  return [start, end, end.getTime() - start.getTime()]
}

function formatRange(item) {
  return `${formatTime(new Date(item.startTime))} - ${formatTime(new Date(item.endTime))}`
}

function getDurationText(item) {
  const [, , duration] = getTimeForFile(item)
  const totalSeconds = Math.max(0, Math.floor(duration / 1000))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds - h * 3600) / 60)
  const s = totalSeconds - h * 3600 - m * 60
  if (h > 0) return `${h}小时${pad(m)}分${pad(s)}秒`
  if (m > 0) return `${m}分${pad(s)}秒`
  return `${s}秒`
}

function playTimeFormat(value) {
  const h = Math.floor(value / 3600)
  const m = Math.floor((value - h * 3600) / 60)
  const s = Math.floor(value - h * 3600 - m * 60)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function goBack() {
  stopPlayRecord(() => router.back())
}

function formatDay(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatDate(date) {
  return `${formatDay(date)} ${formatTime(date)}`
}

function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function toDateTime(value) {
  if (value instanceof Date) return formatDate(value)
  const timeText = String(value || '')
  if (timeText.includes(' ')) return timeText
  return `${chooseDate.value} ${timeText}`
}

function pad(num) {
  return String(num).padStart(2, '0')
}
</script>

<style scoped>
.record-layout {
  min-width: 0;
}

.record-splitpanes {
  height: calc(100vh - 155px);
  min-height: 520px;
}

.video-gb-record-detail-page :deep(.splitpanes__pane) {
  min-width: 0;
}

.record-list-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e6eb;
}

.record-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 12px;
  border-bottom: 1px solid #ebeef5;
}

.record-list-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.record-list-body {
  flex: 1;
  min-height: 0;
}

.record-list-body :deep(.el-empty) {
  height: 100%;
}

.record-file-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-height: 48px;
  padding: 9px 10px;
  border-bottom: 1px solid #f2f3f5;
  cursor: pointer;
  color: #606266;
  transition: background-color 0.2s, color 0.2s;
}

.record-file-item:hover,
.record-file-item.is-active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.record-file-icon {
  flex: 0 0 auto;
  margin-top: 2px;
}

.record-file-main {
  flex: 1;
  min-width: 0;
}

.record-file-time,
.record-file-duration {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-file-time {
  line-height: 20px;
  font-size: 13px;
  color: #303133;
}

.record-file-duration {
  margin-top: 2px;
  line-height: 18px;
  font-size: 12px;
  color: #909399;
}

.record-file-item:hover .record-file-time,
.record-file-item.is-active .record-file-time {
  color: var(--el-color-primary);
}

.record-file-download {
  flex: 0 0 auto;
}

.record-content-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.gb-record-player {
  flex: 1;
  width: 100%;
  min-height: 0;
  background: #000;
}

.gb-record-options {
  flex: 0 0 auto;
  position: relative;
  padding: 12px 20px 34px;
  overflow: visible;
}

.gb-record-controlbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.record-time-range {
  width: 525px;
  max-width: 100%;
}

.record-action-group {
  display: inline-flex;
  flex: 0 0 auto;
}

.record-action-group :deep(.el-button) {
  min-width: 70px;
}

.record-action-group :deep(.el-button .el-icon:only-child) {
  margin: 0;
}

.playtime-slider {
  margin-bottom: 24px;
}

.playtime-slider :deep(.el-slider__runway) {
  margin-bottom: 18px;
}

.playtime-slider :deep(.el-slider__marks-text) {
  margin-top: 12px;
  white-space: nowrap;
}

.playtime-slider :deep(.el-slider__marks-text:first-child) {
  transform: translateX(0);
}

.playtime-slider :deep(.el-slider__marks-text:last-child) {
  transform: translateX(-100%);
}

.slider-val-box {
  height: 6px;
  position: relative;
  top: -46px;
}

.slider-val {
  height: 6px;
  background: #409eff;
  position: absolute;
}

@media (max-width: 992px) {
  .record-splitpanes {
    height: auto;
    min-height: 0;
  }

  .record-list-panel {
    height: 260px;
  }

  .record-content-panel {
    height: 620px;
  }

  .gb-record-controlbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .record-action-group {
    width: 100%;
  }

  .record-action-group :deep(.el-button),
  .record-action-group :deep(.el-dropdown) {
    flex: 1;
  }
}
</style>
