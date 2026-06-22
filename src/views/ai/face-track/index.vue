<template>
  <div class="app-container face-track-page">
    <el-row :gutter="16" class="face-track-main">
      <el-col :lg="6" :md="8" :sm="24" class="face-track-side">
        <el-card shadow="never" class="side-card">
          <template #header>
            <span>人脸轨迹</span>
          </template>

          <el-form :model="queryParams" label-position="top">
            <el-form-item label="人员关键字">
              <el-input v-model="queryParams.keyword" clearable placeholder="姓名 / 证件 / 特征" />
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="queryParams.timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
            <el-button type="primary" :loading="loading" style="width: 100%" @click="searchTrack">查询轨迹</el-button>
          </el-form>

          <el-divider />

          <div v-if="trackRows.length" class="track-list">
            <div
              v-for="(item, index) in trackRows"
              :key="item.id"
              class="track-item"
              :class="{ active: activeIndex === index }"
              @click="focusPoint(index)"
            >
              <div class="track-index">{{ index + 1 }}</div>
              <div class="track-info">
                <div class="track-title">{{ item.cameraName }}</div>
                <div class="track-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无轨迹数据" :image-size="96" />
        </el-card>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24" class="face-track-map">
        <el-card shadow="never" class="map-card">
          <template #header>
            <div class="card-header">
              <span>地图轨迹</span>
              <el-space>
                <el-button icon="Refresh" :disabled="!mapReady" @click="renderTrack">重绘</el-button>
                <el-button type="primary" icon="Aim" :disabled="!mapReady || !trackRows.length" @click="fitTrack">适配视野</el-button>
              </el-space>
            </div>
          </template>
          <AMapComponent ref="mapRef" :center="mapCenter" :zoom="13" @mapInit="handleMapInit" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AMapComponent from '@/components/AMapComponent/index.vue'

const mapRef = ref()
const mapReady = ref(false)
const loading = ref(false)
const activeIndex = ref(-1)
const mapCenter = [113.045883, 23.053416]
const queryParams = reactive({
  keyword: '',
  timeRange: []
})
const trackRows = ref([])

const mockRows = [
  { id: 't1', cameraName: '一层东门枪机01', time: '2026-05-07 09:12:18', lng: 113.0298, lat: 23.0412 },
  { id: 't2', cameraName: '一层大厅球机01', time: '2026-05-07 09:18:36', lng: 113.0386, lat: 23.0466 },
  { id: 't3', cameraName: '二层走廊枪机01', time: '2026-05-07 09:27:09', lng: 113.0502, lat: 23.0525 },
  { id: 't4', cameraName: '三层南侧球机01', time: '2026-05-07 09:35:42', lng: 113.0624, lat: 23.0618 }
]

function handleMapInit() {
  mapReady.value = true
  searchTrack()
}

function searchTrack() {
  loading.value = true
  window.setTimeout(() => {
    trackRows.value = mockRows
    activeIndex.value = -1
    loading.value = false
    nextTick(renderTrack)
  }, 260)
}

function renderTrack() {
  if (!mapReady.value || !mapRef.value) return
  mapRef.value.clearAll()
  const path = trackRows.value.map((item) => [item.lng, item.lat])
  if (path.length > 1) {
    mapRef.value.addPolyline(path, {
      strokeColor: '#2563eb',
      strokeWeight: 5,
      strokeOpacity: 0.88
    })
  }
  trackRows.value.forEach((item, index) => {
    mapRef.value.addMarker([item.lng, item.lat], {
      title: item.cameraName,
      label: {
        content: `${index + 1}. ${item.cameraName}`,
        direction: 'top'
      }
    })
  })
  fitTrack()
}

function fitTrack() {
  if (!mapReady.value || !trackRows.value.length) return
  mapRef.value?.setFitView()
}

function focusPoint(index) {
  const item = trackRows.value[index]
  if (!item) return
  activeIndex.value = index
  if (!mapReady.value) {
    ElMessage.warning('地图还未初始化')
    return
  }
  mapRef.value?.setCenter([item.lng, item.lat])
  mapRef.value?.setZoom(16)
}
</script>

<style scoped>
.face-track-page,
.face-track-main,
.face-track-side,
.face-track-map,
.side-card,
.map-card {
  height: calc(100vh - 126px);
}

.side-card,
.map-card {
  display: flex;
  flex-direction: column;
}

.side-card :deep(.el-card__body),
.map-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 410px);
  overflow: auto;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
}

.track-item:hover,
.track-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.track-index {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  color: #fff;
  background: #409eff;
  font-weight: 600;
}

.track-info {
  min-width: 0;
}

.track-title {
  color: #303133;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-time {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}

.map-card :deep(.el-card__body) {
  padding: 0;
}
</style>
