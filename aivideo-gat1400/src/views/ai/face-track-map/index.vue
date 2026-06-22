<template>
  <div class="app-container face-track-map">
    <el-row :gutter="16" class="track-main">
      <el-col :lg="6" :md="8" :sm="24" class="track-side">
        <el-card shadow="never" class="side-card">
          <template #header>
            <span>涉及区域</span>
          </template>

          <div class="summary-block">
            <div>总抓拍数：{{ totalEvents }}</div>
            <div>涉及区域：{{ areaStats.length }}</div>
          </div>

          <div class="settings-block">
            <div class="side-label">轨迹设置</div>
            <el-radio-group v-model="trackDisplayMode" size="small">
              <el-radio-button label="show">显示轨迹</el-radio-button>
              <el-radio-button label="hide">隐藏轨迹</el-radio-button>
            </el-radio-group>
          </div>

          <div v-if="areaStats.length" class="area-list">
            <div
              v-for="item in areaStats"
              :key="item.areaId"
              class="area-item"
              :class="{ active: item.areaId === selectedAreaId }"
              @click="selectArea(item.areaId)"
            >
              <div class="area-title">{{ item.areaName }}</div>
              <div class="area-meta">
                <span>抓拍 {{ item.captureCount }} 次</span>
                <span>摄像头 {{ item.cameraCount }} 个</span>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无轨迹数据，请先维护平面图点位" :image-size="100" />
        </el-card>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24" class="track-result">
        <el-card shadow="never" class="canvas-card">
          <template #header>
            <div class="card-header">
              <div>
                <div>{{ selectedArea?.areaName || '未选择区域' }}</div>
                <div v-if="selectedAreaStat" class="area-subtitle">
                  抓拍 {{ selectedAreaStat.captureCount }} 次，摄像头 {{ selectedAreaStat.cameraCount }} 个
                </div>
              </div>
              <el-button-group>
                <el-button
                  v-if="showTrackLine"
                  :icon="isTrackPlaying ? 'VideoPause' : 'VideoPlay'"
                  :type="isTrackPlaying ? 'primary' : 'default'"
                  :disabled="!canPlayTrack"
                  @click="toggleTrack"
                />
                <el-button v-if="showTrackLine" icon="Refresh" :disabled="!canResetTrack" @click="resetTrackPlayback" />
                <el-button icon="Rank" :type="isPanMode ? 'primary' : 'default'" :disabled="!imageUrl || isTrackPlaying" @click="isPanMode = !isPanMode" />
                <el-button icon="ZoomIn" :disabled="!imageUrl" @click="canvasRef?.zoomIn()" />
                <el-button icon="ZoomOut" :disabled="!imageUrl" @click="canvasRef?.zoomOut()" />
              </el-button-group>
            </div>
          </template>

          <PlanCanvas
            ref="canvasRef"
            mode="view"
            :image-url="imageUrl"
            :image-width="imageSize.width"
            :image-height="imageSize.height"
            :track-points="visibleTrackPoints"
            :show-track-line="showTrackLine"
            :is-pan-mode="isPanMode"
            empty-text="当前区域暂无可用平面图"
            @track-point-click="openCaptureDialog"
            @track-playback-change="handleTrackPlaybackChange"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="captureDialog.visible" :title="captureDialog.title" width="760px" append-to-body>
      <el-table :data="captureDialog.rows" max-height="420" border>
        <el-table-column prop="displayOrder" label="序号" width="72" align="center" />
        <el-table-column prop="timeText" label="时间" width="180" />
        <el-table-column prop="cameraName" label="摄像头名称" min-width="180" />
        <el-table-column label="缩略图" width="130" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.thumbUrl"
              :src="row.thumbUrl"
              :preview-src-list="[row.thumbUrl]"
              :z-index="4000"
              fit="cover"
              preview-teleported
              class="capture-thumb"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import PlanCanvas from '@/components/PlanCanvas/index.vue'
import { listPlanMaps } from '@/views/ai/plan-map/store'
import { formatDate } from '../viid-utils'

const canvasRef = ref()
const selectedAreaId = ref('')
const isPanMode = ref(true)
const isTrackPlaying = ref(false)
const trackDisplayMode = ref('show')
const trackPlaybackVisible = ref(false)
const trackPlaybackProgress = ref(0)
const captureDialog = reactive({
  visible: false,
  title: '抓拍列表',
  rows: []
})

const plans = ref(listPlanMaps().filter((item) => item.imageUrl && item.markers?.length))
const demoAreas = computed(() => plans.value.map((plan) => ({
  areaId: plan.id,
  areaName: plan.name,
  imageUrl: plan.imageUrl,
  imageWidth: plan.imageWidth,
  imageHeight: plan.imageHeight,
  markers: plan.markers,
  cameras: plan.cameras
})))

const mappedEvents = computed(() => {
  const events = []
  demoAreas.value.forEach((area, areaIndex) => {
    area.markers.forEach((marker, markerIndex) => {
      const camera = area.cameras.find((item) => item.id === marker.cameraId) || {}
      const repeats = markerIndex % 2 === 0 ? 2 : 1
      for (let i = 0; i < repeats; i += 1) {
        events.push({
          id: `${area.areaId}-${marker.cameraId}-${i}`,
          areaId: area.areaId,
          areaName: area.areaName,
          cameraId: marker.cameraId,
          cameraName: camera.name || marker.cameraId,
          marker,
          timestamp: Date.now() - (areaIndex * 3600 + markerIndex * 480 + i * 120) * 1000,
          thumbUrl: area.imageUrl
        })
      }
    })
  })
  return events.sort((a, b) => a.timestamp - b.timestamp)
})

const totalEvents = computed(() => mappedEvents.value.length)
const showTrackLine = computed(() => trackDisplayMode.value === 'show')
const areaStats = computed(() => {
  const map = {}
  mappedEvents.value.forEach((item) => {
    if (!item.areaId || !item.marker) return
    if (!map[item.areaId]) {
      map[item.areaId] = {
        areaId: item.areaId,
        areaName: item.areaName,
        captureCount: 0,
        cameraIds: new Set()
      }
    }
    map[item.areaId].captureCount += 1
    map[item.areaId].cameraIds.add(item.cameraId)
  })
  return Object.values(map).map((item) => ({
    areaId: item.areaId,
    areaName: item.areaName,
    captureCount: item.captureCount,
    cameraCount: item.cameraIds.size
  }))
})
const selectedArea = computed(() => demoAreas.value.find((item) => item.areaId === selectedAreaId.value) || null)
const selectedAreaStat = computed(() => areaStats.value.find((item) => item.areaId === selectedAreaId.value) || null)
const selectedAreaEvents = computed(() => mappedEvents.value.filter((item) => item.areaId === selectedAreaId.value && item.marker))
const visibleTrackPoints = computed(() => selectedAreaEvents.value.map((item, index) => ({
  ...item,
  displayOrder: index + 1,
  xRatio: item.marker.xRatio,
  yRatio: item.marker.yRatio,
  timeText: formatDate(item.timestamp)
})))
const imageUrl = computed(() => selectedArea.value?.imageUrl || '')
const imageSize = computed(() => ({
  width: selectedArea.value?.imageWidth || 0,
  height: selectedArea.value?.imageHeight || 0
}))
const canPlayTrack = computed(() => showTrackLine.value && !!imageUrl.value && visibleTrackPoints.value.length > 1)
const canResetTrack = computed(() => showTrackLine.value && (isTrackPlaying.value || trackPlaybackVisible.value || trackPlaybackProgress.value > 0))

if (areaStats.value.length) selectedAreaId.value = areaStats.value[0].areaId

function selectArea(areaId) {
  selectedAreaId.value = areaId
  isPanMode.value = true
  resetTrackPlayback()
  nextTick(() => canvasRef.value?.resetView())
}

function toggleTrack() {
  if (isTrackPlaying.value) {
    canvasRef.value?.stopTrackAnimation(false)
  } else {
    canvasRef.value?.playTrackAnimation()
  }
}

function resetTrackPlayback() {
  canvasRef.value?.stopTrackAnimation(true)
}

function handleTrackPlaybackChange(payload) {
  isTrackPlaying.value = !!payload.playing
  trackPlaybackVisible.value = !!payload.visible
  trackPlaybackProgress.value = Number(payload.progress) || 0
}

function openCaptureDialog(point) {
  const sameCameraRows = visibleTrackPoints.value.filter((item) => item.cameraId === point.cameraId)
  captureDialog.title = `${point.cameraName || point.cameraId} 抓拍列表`
  captureDialog.rows = sameCameraRows
  captureDialog.visible = true
}
</script>

<style scoped>
.face-track-map,
.track-main,
.track-side,
.track-result,
.side-card,
.canvas-card {
  height: calc(100vh - 126px);
}

.side-card,
.canvas-card {
  display: flex;
  flex-direction: column;
}

.side-card :deep(.el-card__body),
.canvas-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}

.summary-block {
  padding: 10px 12px;
  margin-bottom: 14px;
  color: #606266;
  background: #f8fafc;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  line-height: 1.8;
}

.settings-block {
  margin-bottom: 14px;
}

.side-label {
  margin-bottom: 8px;
  color: #606266;
  font-size: 13px;
  font-weight: 600;
}

.area-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 340px);
  overflow: auto;
}

.area-item {
  padding: 10px 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.area-item:hover,
.area-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.area-title {
  color: #303133;
  font-weight: 600;
}

.area-meta,
.area-subtitle {
  margin-top: 5px;
  color: #909399;
  font-size: 12px;
  display: flex;
  gap: 12px;
}

.canvas-card :deep(.el-card__body) {
  padding: 0;
}

.capture-thumb {
  width: 96px;
  height: 58px;
  border-radius: 4px;
}
</style>
