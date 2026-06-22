<template>
  <div class="app-container video-map-page">
    <el-row :gutter="20" class="video-map-layout">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
        <pane size="18">
          <el-col>
            <div class="head-container video-map-tree">
              <DeviceTreeNational emit-device @node-click="handleTreeNodeClick" />
            </div>
          </el-col>
        </pane>

        <pane size="82">
          <el-col>
            <div class="video-map-canvas" v-loading="loading">
              <AMapComponent ref="mapRef" @mapInit="handleMapInit" />
              <div v-if="currentChannel" class="channel-info-panel">
                <div class="channel-info-title">
                  <span>{{ currentChannel.name || '-' }}</span>
                  <el-button link icon="Close" @click="currentChannel = null" />
                </div>
                <el-descriptions :column="1" size="small">
                  <el-descriptions-item label="编号">{{ currentChannel.channelId }}</el-descriptions-item>
                  <el-descriptions-item label="经度">{{ currentChannel[longitudeKey] }}</el-descriptions-item>
                  <el-descriptions-item label="纬度">{{ currentChannel[latitudeKey] }}</el-descriptions-item>
                  <el-descriptions-item label="生产厂商">{{ currentChannel.manufacture }}</el-descriptions-item>
                  <el-descriptions-item label="安装地址">{{ currentChannel.address || '未知' }}</el-descriptions-item>
                  <el-descriptions-item label="通道状态">
                    <el-tag v-if="currentChannel.status === true || currentChannel.status === 1" size="small">在线</el-tag>
                    <el-tag v-else size="small" type="info">离线</el-tag>
                  </el-descriptions-item>
                </el-descriptions>
                <el-space>
                  <el-button type="primary" size="small" icon="VideoPlay" @click="play(currentChannel)" />
                  <el-button type="primary" size="small" icon="Edit" @click="editPosition" />
                  <el-button type="primary" size="small" icon="MapLocation" @click="openTrace(currentChannel)" />
                </el-space>
              </div>
            </div>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <el-dialog v-model="traceOpen" title="查询轨迹" width="520px" append-to-body>
      <el-date-picker
        v-model="traceRange"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        style="width: 100%"
      />
      <template #footer>
        <el-button @click="traceOpen = false">取消</el-button>
        <el-button type="primary" :loading="traceLoading" @click="queryTrace">查询</el-button>
      </template>
    </el-dialog>

    <DevicePlayer ref="devicePlayerRef" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import useAppStore from '@/store/modules/app'
import AMapComponent from '@/components/AMapComponent/index.vue'
import DeviceTreeNational from '@/components/video/DeviceTreeNational/index.vue'
import DevicePlayer from '@/components/video/DevicePlayer/index.vue'
import request from '@/utils/video/request'
import { getNodeBusinessData } from '@/utils/video/stream'

const route = useRoute()
const appStore = useAppStore()
const mapRef = ref(null)
const devicePlayerRef = ref(null)
const loading = ref(false)
const mapReady = ref(false)
const currentChannel = ref(null)
const traceOpen = ref(false)
const traceLoading = ref(false)
const traceChannel = ref(null)
const traceRange = ref([])
const longitudeKey = ref('longitude')
const latitudeKey = ref('latitude')
const currentDeviceId = ref('')

onMounted(() => {
  currentDeviceId.value = route.query.deviceId || ''
  initCoordinateKeys()
})

function initCoordinateKeys() {
  const coordinateSystem = window.mapParam?.coordinateSystem
  if (coordinateSystem === 'GCJ-02') {
    longitudeKey.value = 'longitudeGcj02'
    latitudeKey.value = 'latitudeGcj02'
  } else if (coordinateSystem === 'WGS84') {
    longitudeKey.value = 'longitudeWgs84'
    latitudeKey.value = 'latitudeWgs84'
  }
}

function handleMapInit() {
  mapReady.value = true
  if (currentDeviceId.value) {
    locateDevice()
  }
}

function handleTreeNodeClick(nodeData) {
  const data = getNodeBusinessData(nodeData)
  if (data.channelId) {
    addChannelMarkers([data])
    return
  }

  if (data.deviceId) {
    currentDeviceId.value = data.deviceId
    locateDevice()
  }
}

function locateDevice() {
  if (!currentDeviceId.value) return
  if (!mapReady.value) return

  loading.value = true
  getAllChannel(currentDeviceId.value)
    .then((channels) => {
      addChannelMarkers(channels)
    })
    .finally(() => {
      loading.value = false
    })
}

async function getAllChannel(deviceId) {
  let page = 1
  const count = 100
  let result = []
  let total = 0
  do {
    const res = await request({
      method: 'get',
      url: `/api/device/query/devices/${deviceId}/channels`,
      params: {
        page,
        count,
        query: '',
        online: '',
        channelType: '',
        catalogUnderDevice: false
      }
    })
    const data = res.data || {}
    result = result.concat(data.list || [])
    total = data.total || result.length
    page += 1
  } while (result.length < total)
  return result
}

function addChannelMarkers(channels) {
  cleanMap()
  const markers = []
  channels.forEach((channel) => {
    const position = getPosition(channel)
    if (!position) return
    const marker = mapRef.value?.addMarker(position, {
      title: channel.name || channel.channelId,
      label: {
        content: channel.name || channel.channelId,
        direction: 'top'
      }
    })
    marker?.on?.('click', () => {
      currentChannel.value = channel
    })
    if (marker) markers.push(marker)
  })

  if (markers.length === 0) {
    ElMessage.error('未获取到位置信息')
    return
  }

  if (markers.length === 1) {
    const channel = channels.find((item) => getPosition(item))
    mapRef.value?.setCenter(getPosition(channel))
    mapRef.value?.setZoom(window.mapParam?.maxZoom || 16)
  } else {
    mapRef.value?.setFitView(markers)
  }
}

function cleanMap() {
  mapRef.value?.clearMarkers()
  mapRef.value?.clearPolylines()
  currentChannel.value = null
}

function getPosition(channel) {
  const longitude = Number(channel?.[longitudeKey.value])
  const latitude = Number(channel?.[latitudeKey.value])
  if (!longitude || !latitude) return null
  return [longitude, latitude]
}

function play(channel) {
  request({
    method: 'get',
    url: `/api/play/start/${channel.deviceId}/${channel.channelId}`
  }).then((res) => {
    devicePlayerRef.value?.openDialog('media', channel.deviceId, channel.channelId, {
      streamInfo: res.data,
      hasAudio: channel.hasAudio
    })
  })
}

function editPosition() {
  ElMessage.warning('暂不支持')
}

function openTrace(channel) {
  traceChannel.value = channel
  traceRange.value = []
  traceOpen.value = true
}

function queryTrace() {
  if (!traceChannel.value || traceRange.value.length !== 2) {
    ElMessage.warning('请选择时间范围')
    return
  }
  traceLoading.value = true
  request({
    method: 'get',
    url: `/api/position/history/${traceChannel.value.deviceId}`,
    params: {
      start: traceRange.value[0],
      end: traceRange.value[1],
      channelId: traceChannel.value.channelId
    }
  })
    .then((res) => {
      const positions = (res.data || []).map((item) => getPosition(item)).filter(Boolean)
      mapRef.value?.clearPolylines()
      if (positions.length === 0) {
        ElMessage.success('未查询到轨迹信息')
        return
      }
      const line = mapRef.value?.addPolyline(positions)
      mapRef.value?.setFitView([line])
      traceOpen.value = false
    })
    .finally(() => {
      traceLoading.value = false
    })
}
</script>

<style scoped>
.video-map-page {
  min-height: calc(100vh - 84px);
}

.video-map-layout,
.video-map-page :deep(.splitpanes),
.video-map-page :deep(.splitpanes__pane) {
  min-height: calc(100vh - 124px);
}

.video-map-tree {
  height: calc(100vh - 144px);
  overflow: auto;
}

.video-map-canvas {
  position: relative;
  height: calc(100vh - 124px);
  min-height: 560px;
}

.channel-info-panel {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 8;
  width: 280px;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
}

.channel-info-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
}
</style>
