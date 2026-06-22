<template>
  <div class="app-container video-cloud-record-detail-page">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="Back" plain @click="backToList">返回</el-button>
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
      <el-col v-if="false" :span="1.5">
        <el-button type="primary" plain icon="Scissor" :disabled="detailFiles.length === 0 || !mediaServerId" @click="drawerOpen">
          裁剪下载
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-tag type="info">{{ app || '-' }} / {{ stream || '-' }}</el-tag>
      </el-col>
      <el-col :span="1.5" v-if="mediaServerId">
        <el-tag>{{ mediaServerId }}</el-tag>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="dateChange"></right-toolbar>
    </el-row>

    <div class="record-layout">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme record-splitpanes">
        <pane size="22" min-size="16">
          <div class="record-list-panel" v-loading="loading">
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
                  :key="item.id || item.fileName"
                  class="record-file-item"
                  :class="{ 'is-active': selectedFileName === item.fileName }"
                  @click="chooseFile(item)"
                >
                  <el-icon class="record-file-icon"><VideoCamera /></el-icon>
                  <div class="record-file-main">
                    <span class="record-file-time">{{ getFileShowName(item) }}</span>
                    <span class="record-file-duration">{{ getDurationText(item) }}</span>
                  </div>
                  <el-link
                    class="record-file-download"
                    :href="getDownloadUrl(item)"
                    target="_blank"
                    :underline="false"
                    title="下载"
                    @click.stop
                  >
                    <el-icon><Download /></el-icon>
                  </el-link>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </pane>
        <pane size="78" min-size="50">
          <div class="record-content-panel">
            <div class="cloud-detail-player">
              <StreamPlayer :url="videoUrl" />
            </div>
            <div class="cloud-detail-options">
              <div ref="timelineRef" class="record-timeline">
                <el-slider
                  v-model="playTime"
                  class="playtime-slider"
                  :disabled="detailFiles.length === 0"
                  :min="sliderMin"
                  :max="sliderMax"
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

    <el-drawer v-model="drawer" title="录像下载" direction="ltr" size="420px">
      <div class="drawer-actions">
        <el-button type="primary" icon="Plus" :disabled="detailFiles.length === 0" @click="addTask">新增任务</el-button>
      </div>
      <el-tabs v-model="tabVal" type="border-card" @tab-change="tabClick">
        <el-tab-pane label="进行中" name="running">
          <el-empty v-if="taskListForRunning.length === 0" description="暂无任务" />
          <div v-for="item in taskListForRunning" :key="item.id || `${item.startTime}-${item.endTime}`" class="task-list-item">
            <span>{{ item.startTime?.substring(10) }} - {{ item.endTime?.substring(10) }}</span>
            <el-progress :percentage="Number((Number(item.percentage || 0) * 100).toFixed(1))" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="ended">
          <el-empty v-if="taskListEnded.length === 0" description="暂无任务" />
          <div v-for="item in taskListEnded" :key="item.id || `${item.startTime}-${item.endTime}`" class="task-list-item">
            <span>{{ item.startTime?.substring(10) }} - {{ item.endTime?.substring(10) }}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <el-dialog v-model="showTaskBox" title="选择时间段" width="520px" append-to-body>
      <el-date-picker
        v-model="taskTimeRange"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        style="width: 100%"
      />
      <template #footer>
        <el-button @click="showTaskBox = false">取消</el-button>
        <el-button type="primary" @click="addTaskToServer">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { Download, VideoCamera } from '@element-plus/icons-vue'
import useAppStore from '@/store/modules/app'
import request, { VIDEO_API_BASE_URL } from '@/utils/video/request'
import StreamPlayer from '@/components/video/StreamPlayer/index.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const timelineRef = ref(null)
const app = ref('')
const stream = ref('')
const mediaServerId = ref('')
const detailFiles = ref([])
const dateFilesObj = ref({})
const loading = ref(false)
const chooseDate = ref('')
const videoUrl = ref('')
const selectedFileName = ref('')
const currentPage = ref(1)
const total = ref(0)
const sliderMin = ref(0)
const sliderMax = ref(86400)
const playTime = ref(0)
const queryDate = ref(new Date())
const drawer = ref(false)
const showTaskBox = ref(false)
const taskTimeRange = ref([])
const taskListEnded = ref([])
const taskListForRunning = ref([])
const tabVal = ref('running')
const timelineWidth = ref(0)
const playTimeSliderMarks = computed(() => buildPlayTimeSliderMarks(timelineWidth.value, sliderMin.value, sliderMax.value))
let timelineResizeObserver = null

onMounted(() => {
  app.value = route.query.app || ''
  stream.value = route.query.stream || ''
  mediaServerId.value = route.query.mediaServerId || ''
  getDateInYear(() => {
    const dates = Object.values(dateFilesObj.value)
    chooseDate.value = dates.length > 0 ? dates[dates.length - 1] : formatDay(new Date())
      dateChange()
      initTimelineObserver()
  })
})

onBeforeUnmount(() => {
  if (timelineResizeObserver) {
    timelineResizeObserver.disconnect()
    timelineResizeObserver = null
  }
  window.removeEventListener('resize', updateTimelineWidth)
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
  if (!chooseDate.value) return
  playTime.value = 0
  detailFiles.value = []
  currentPage.value = 1
  sliderMin.value = 0
  sliderMax.value = 86400
  const chooseFullDate = new Date(`${chooseDate.value} 00:00:00`)
  if (chooseFullDate.getFullYear() !== queryDate.value.getFullYear() || chooseFullDate.getMonth() !== queryDate.value.getMonth()) {
    queryDate.value = chooseFullDate
    getDateInYear()
  }
  queryRecordDetails(() => {
    if (detailFiles.value.length === 0) return
    const firstTime = getTimeForFile(detailFiles.value[0])
    const lastTime = getTimeForFile(detailFiles.value[detailFiles.value.length - 1])
    const dayStart = new Date(`${chooseDate.value} 00:00:00`).getTime()
    const startOffset = firstTime[0].getTime() - dayStart
    const endOffset = lastTime[1].getTime() - dayStart
    playTime.value = Math.floor(startOffset / 1000)
    sliderMin.value = Math.floor(startOffset / 1000 - (startOffset / 1000) % 3600)
    sliderMax.value = Math.floor(endOffset / 1000 - (endOffset / 1000) % 3600) + 3600
  })
}

function queryRecordDetails(callback) {
  loading.value = true
  request({
    method: 'get',
    url: '/api/cloud/record/list',
    params: {
      app: app.value,
      stream: stream.value,
      startTime: `${chooseDate.value} 00:00:00`,
      endTime: `${chooseDate.value} 23:59:59`,
      page: currentPage.value,
      count: 1000000,
      mediaServerId: mediaServerId.value
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      detailFiles.value = detailFiles.value.concat(res.data?.list || [])
      const serverSet = new Set(detailFiles.value.map((item) => item.mediaServerId).filter(Boolean))
      if (!mediaServerId.value && serverSet.size === 1) {
        mediaServerId.value = Array.from(serverSet)[0]
      }
      callback?.()
    })
    .finally(() => {
      loading.value = false
    })
}

function chooseFile(file) {
  selectedFileName.value = file?.fileName || ''
  videoUrl.value = file ? `${getFileBasePath(file)}/download/${app.value}/${stream.value}/${chooseDate.value}/${file.fileName}` : ''
}

function getFileShowName(item) {
  return `${formatTime(new Date(Number(item.startTime) * 1000))} - ${formatTime(new Date(Number(item.endTime) * 1000))}`
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

function getDownloadUrl(item) {
  return `${getFileBasePath(item)}/download.html?url=download/${app.value}/${stream.value}/${chooseDate.value}/${item.fileName}`
}

function getFileBasePath(item = {}) {
  const serverId = item.mediaServerId || mediaServerId.value
  return `${VIDEO_API_BASE_URL}/record_proxy/${serverId}`
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

function playTimeChange(value) {
  if (detailFiles.value.length === 0) return
  chooseFile(null)
  const dayStart = new Date(`${chooseDate.value} 00:00:00`).getTime()
  const target = dayStart + value * 1000
  for (const file of detailFiles.value) {
    const [start, end] = getTimeForFile(file)
    if (target >= start.getTime() && target <= end.getTime()) {
      chooseFile(file)
      return
    }
  }
}

function getTimeForFile(file) {
  const startTime = new Date(Number(file.startTime) * 1000)
  let endTime = new Date(Number(file.endTime) * 1000)
  if (startTime > endTime) {
    endTime = new Date(`${chooseDate.value} 23:59:59`)
  }
  return [startTime, endTime, endTime.getTime() - startTime.getTime()]
}

function playTimeFormat(value) {
  const h = Math.floor(value / 3600)
  const m = Math.floor((value - h * 3600) / 60)
  const s = Math.floor(value - h * 3600 - m * 60)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function getDateInYear(callback) {
  dateFilesObj.value = {}
  request({
    method: 'get',
    url: '/api/cloud/record/date/list',
    params: {
      app: app.value,
      stream: stream.value,
      year: queryDate.value.getFullYear(),
      month: queryDate.value.getMonth() + 1,
      mediaServerId: mediaServerId.value
    }
  }).then((res) => {
    ;(res.data || []).forEach((item) => {
      dateFilesObj.value[item] = item
    })
    callback?.()
  })
}

function drawerOpen() {
  drawer.value = true
  getTaskList(false)
}

function tabClick() {
  getTaskList(tabVal.value === 'ended')
}

function addTask() {
  if (detailFiles.value.length === 0) return
  const first = detailFiles.value[0]
  const last = detailFiles.value[detailFiles.value.length - 1]
  taskTimeRange.value = [formatDate(new Date(Number(first.startTime) * 1000)), formatDate(new Date(Number(last.endTime) * 1000))]
  showTaskBox.value = true
}

function addTaskToServer() {
  if (!taskTimeRange.value || taskTimeRange.value.length !== 2) {
    ElMessage.warning('请选择时间段')
    return
  }
  request({
    method: 'get',
    url: '/api/cloud/record/task/add',
    params: {
      app: app.value,
      stream: stream.value,
      mediaServerId: mediaServerId.value,
      startTime: taskTimeRange.value[0],
      endTime: taskTimeRange.value[1]
    }
  }).then(() => {
    showTaskBox.value = false
    getTaskList(false)
  })
}

function getTaskList(isEnd) {
  if (!mediaServerId.value) return
  request({
    method: 'get',
    url: '/api/cloud/record/task/list',
    params: {
      mediaServerId: mediaServerId.value,
      isEnd
    }
  }).then((res) => {
    if (isEnd) {
      taskListEnded.value = res.data || []
    } else {
      taskListForRunning.value = res.data || []
    }
  })
}

function backToList() {
  router.back()
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

.video-cloud-record-detail-page :deep(.splitpanes__pane) {
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

.cloud-detail-player {
  flex: 1;
  width: 100%;
  min-height: 0;
  background: #000;
}

.cloud-detail-options {
  flex: 0 0 auto;
  position: relative;
  padding: 12px 20px 34px;
  overflow: visible;
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

.drawer-actions {
  margin-bottom: 12px;
}

.task-list-item {
  margin-bottom: 14px;
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
}
</style>
