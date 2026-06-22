<template>
  <div class="app-container video-live-page">
    <el-row :gutter="20">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
        <pane size="22">
          <el-col>
            <div class="head-container video-live-tree-head">
              <span>演示摄像头</span>
              <el-button type="primary" plain size="small" icon="VideoPlay" @click="loadCurrentSplit(false)">
                批量加载
              </el-button>
            </div>

            <div class="head-container video-live-camera-tools">
              <el-input
                v-model="cameraKeyword"
                clearable
                prefix-icon="Search"
                placeholder="搜索地址/房间/编号"
              />
              <div class="video-live-camera-summary">
                <span>共 {{ filteredCameraList.length }} 路</span>
                <span v-if="filteredCameraList.length">
                  当前 {{ batchStartIndex + 1 }} - {{ batchEndIndex }}
                </span>
              </div>
            </div>

            <div class="head-container video-live-tree-panel video-live-camera-list">
              <button
                v-for="(camera, index) in filteredCameraList"
                :key="camera.cameraNo"
                class="video-live-camera-item"
                :class="{
                  'is-active': activeCameraNo === camera.cameraNo,
                  'is-playing': isCameraPlaying(camera.cameraNo)
                }"
                type="button"
                @click="playCamera(camera)"
              >
                <div class="video-live-camera-item__top">
                  <span>{{ index + 1 }}. {{ camera.room }}</span>
                  <el-tag
                    v-if="getCameraTagText(camera.cameraNo)"
                    :type="getCameraTagType(camera.cameraNo)"
                    size="small"
                  >
                    {{ getCameraTagText(camera.cameraNo) }}
                  </el-tag>
                </div>
                <div class="video-live-camera-item__no">{{ camera.cameraNo }}</div>
                <div class="video-live-camera-item__address">{{ camera.address }}</div>
              </button>
              <el-empty v-if="!filteredCameraList.length" description="暂无匹配摄像头" />
            </div>
          </el-col>
        </pane>

        <pane size="78">
          <el-col>
            <el-form :inline="true" v-show="showSearch" label-width="80px">
              <el-form-item label="当前窗口">
                <el-tag type="primary">第 {{ activeIndex + 1 }} 窗口</el-tag>
              </el-form-item>
              <el-form-item label="当前摄像头">
                <el-tag v-if="activeCamera" type="success">{{ activeCamera.cameraNo }}</el-tag>
                <el-tag v-else type="info">未选择</el-tag>
              </el-form-item>
              <el-form-item label="请求数量">
                <el-tag type="primary">{{ currentBatchCameras.length }} / {{ splitCount }}</el-tag>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="VideoPlay" @click="loadCurrentSplit(false)">加载当前分屏</el-button>
                <el-button icon="Refresh" @click="refreshPlayingSlots">刷新播放地址</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button :type="splitCount === 1 ? 'primary' : 'default'" plain icon="FullScreen" @click="setSplit(1)">
                  单屏
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button :type="splitCount === 4 ? 'primary' : 'default'" plain icon="Menu" @click="setSplit(4)">
                  四屏
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button :type="splitCount === 9 ? 'primary' : 'default'" plain icon="Grid" @click="setSplit(9)">
                  九屏
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button plain icon="ArrowLeft" :disabled="!hasPrevBatch" @click="loadPrevBatch">上一组</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button plain icon="ArrowRight" :disabled="!hasNextBatch" @click="loadNextBatch">下一组</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" @click="clearCurrent">清空当前</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="warning" plain icon="Close" @click="clearAll">清空全部</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="loadCurrentSplit(false)" />
            </el-row>

            <div class="video-live-player" v-loading="loading" element-loading-text="正在请求播放地址...">
              <div class="video-live-grid" :class="`is-split-${splitCount}`">
                <div
                  v-for="index in splitCount"
                  :key="index"
                  class="video-live-grid__cell"
                  :class="{ 'is-active': activeIndex === index - 1 }"
                  @click="activeIndex = index - 1"
                >
                  <div v-if="slotCameras[index - 1]" class="video-live-slot-title">
                    <span>{{ slotCameras[index - 1].room }}</span>
                    <small>{{ slotCameras[index - 1].cameraNo }}</small>
                  </div>
                  <StreamPlayer
                    url="https://video0.iuoooo.com/openlive/d7340152_1/index.m3u8?sign=53f06e76cf7dce4a0be121b1e8e41b7b&t=6a06d9a3"
                    @clear="clearPlayer(index - 1)"
                    @error="handlePlayerError"
                    @timeout="handlePlayerTimeout(index - 1)"
                  >
                    <div class="video-live-empty">
                      <span>{{ index }}</span>
                      <small>{{ getSlotPlaceholder(index - 1) }}</small>
                    </div>
                  </StreamPlayer>
                </div>
              </div>
            </div>
          </el-col>
        </pane>
      </splitpanes>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import useAppStore from '@/store/modules/app'
import request from '@/utils/video/request'
import StreamPlayer from '@/components/video/StreamPlayer/index.vue'
import { DEMO_CAMERA_LIST } from './demoCameras'

const SPLIT_KEY = 'live2ThirdLiveSplit'
const LEGACY_URLS_KEY = 'videoUrl'
const LEGACY_PLAY_DATA_KEY = 'playData'
const VIDEO_STREAM_TYPE = ''

const appStore = useAppStore()
const loading = ref(false)
const activeIndex = ref(0)
const showSearch = ref(true)
const cameraKeyword = ref('')
const batchStartIndex = ref(0)
const splitCount = ref(readSplitCount(4))
const videoUrls = ref(createUrlSlots())
const slotCameras = ref(createCameraSlots())
const playStates = ref({})
const activatedOnce = ref(false)

const filteredCameraList = computed(() => {
  const keyword = cameraKeyword.value.trim().toLowerCase()
  if (!keyword) return DEMO_CAMERA_LIST

  return DEMO_CAMERA_LIST.filter((camera) => {
    return [camera.address, camera.room, camera.cameraNo].some((value) => value.toLowerCase().includes(keyword))
  })
})

const batchEndIndex = computed(() => Math.min(batchStartIndex.value + splitCount.value, filteredCameraList.value.length))
const currentBatchCameras = computed(() => filteredCameraList.value.slice(batchStartIndex.value, batchEndIndex.value))
const activeUrl = computed(() => videoUrls.value[activeIndex.value] || '')
const activeCamera = computed(() => slotCameras.value[activeIndex.value] || null)
const activeCameraNo = computed(() => activeCamera.value?.cameraNo || '')
const hasPrevBatch = computed(() => batchStartIndex.value > 0)
const hasNextBatch = computed(() => batchEndIndex.value < filteredCameraList.value.length)

watch(splitCount, (value) => {
  localStorage.setItem(SPLIT_KEY, String(value))
  if (activeIndex.value >= value) activeIndex.value = 0
  clampBatchStart()
})

watch(filteredCameraList, () => {
  batchStartIndex.value = 0
})

onMounted(() => {
  window.dispatchEvent(new CustomEvent('exitFullScreen'))
  enterLivePage()
})

onActivated(() => {
  if (!activatedOnce.value) {
    activatedOnce.value = true
    return
  }
  enterLivePage()
})

function enterLivePage() {
  clearLegacyPlayCache()
  resetPlayers()
  loadCurrentSplit(true)
}

function readSplitCount(defaultValue) {
  const value = Number(localStorage.getItem(SPLIT_KEY))
  return [1, 4, 9].includes(value) ? value : defaultValue
}

function createUrlSlots() {
  return Array.from({ length: 9 }, () => '')
}

function createCameraSlots() {
  return Array.from({ length: 9 }, () => null)
}

function resetPlayers() {
  videoUrls.value = createUrlSlots()
  slotCameras.value = createCameraSlots()
  activeIndex.value = 0
}

function setSplit(value) {
  if (splitCount.value === value) return
  splitCount.value = value
  activeIndex.value = 0
  loadCurrentSplit(false)
}

async function loadCurrentSplit(silent = false) {
  if (!currentBatchCameras.value.length) {
    if (!silent) ElMessage.warning('没有可加载的摄像头')
    return
  }

  const targets = currentBatchCameras.value.map((camera, index) => ({ camera, index }))
  await requestAndApplyPlayUrls(targets, silent)
}

async function playCamera(camera) {
  await requestAndApplyPlayUrls([{ camera, index: activeIndex.value }], false)
}

async function refreshPlayingSlots() {
  const targets = slotCameras.value
    .slice(0, splitCount.value)
    .map((camera, index) => ({ camera, index }))
    .filter((item) => item.camera)

  if (!targets.length) {
    await loadCurrentSplit(false)
    return
  }

  await requestAndApplyPlayUrls(targets, false)
}

function loadPrevBatch() {
  if (!hasPrevBatch.value) return
  batchStartIndex.value = Math.max(0, batchStartIndex.value - splitCount.value)
  activeIndex.value = 0
  loadCurrentSplit(false)
}

function loadNextBatch() {
  if (!hasNextBatch.value) return
  batchStartIndex.value = Math.min(maxBatchStart(), batchStartIndex.value + splitCount.value)
  activeIndex.value = 0
  loadCurrentSplit(false)
}

async function requestAndApplyPlayUrls(targets, silent = false) {
  const cameraNos = [...new Set(targets.map(({ camera }) => camera.cameraNo))]
  if (!cameraNos.length) return

  loading.value = true
  targets.forEach(({ camera }) => setCameraState(camera.cameraNo, 'loading'))

  try {
    const res = await request({
      url: '/api/third-live/play/list',
      method: 'post',
      data: {
        cameraNos,
        videoStreamType: VIDEO_STREAM_TYPE,
        includeFailed: true
      }
    })

    if (!isSuccessResponse(res)) {
      throw new Error(res?.msg || '请求播放地址失败')
    }

    const resultMap = new Map((res.data?.list || []).map((item) => [String(item.cameraNo), item]))
    const nextUrls = [...videoUrls.value]
    const nextSlotCameras = [...slotCameras.value]
    let successCount = 0

    targets.forEach(({ camera, index }) => {
      const result = resultMap.get(camera.cameraNo)
      const url = result?.sdUrl || ''
      nextSlotCameras[index] = camera

      if (url && result?.success !== false) {
        nextUrls[index] = url
        successCount += 1
        setCameraState(camera.cameraNo, 'success')
        return
      }

      nextUrls[index] = ''
      setCameraState(camera.cameraNo, 'failed', result?.errorMsg || '接口未返回 sdUrl')
    })

    videoUrls.value = nextUrls
    slotCameras.value = nextSlotCameras
    showLoadMessage(successCount, targets.length - successCount, silent)
  } catch (error) {
    targets.forEach(({ camera }) => setCameraState(camera.cameraNo, 'failed', error?.message || '请求失败'))
    if (!silent) ElMessage.error(error?.message || '请求播放地址失败')
  } finally {
    loading.value = false
  }
}

function showLoadMessage(successCount, failedCount, silent) {
  if (failedCount > 0) {
    ElMessage.warning(`已加载 ${successCount} 路，失败 ${failedCount} 路`)
    return
  }

  if (!silent) {
    ElMessage.success(`已加载 ${successCount} 路视频`)
  }
}

function setCameraState(cameraNo, status, message = '') {
  playStates.value = {
    ...playStates.value,
    [cameraNo]: { status, message }
  }
}

function getCameraState(cameraNo) {
  return playStates.value[cameraNo] || {}
}

function getCameraTagText(cameraNo) {
  if (isCameraPlaying(cameraNo)) return '播放中'

  const state = getCameraState(cameraNo)
  if (state.status === 'loading') return '请求中'
  if (state.status === 'failed') return '失败'
  return ''
}

function getCameraTagType(cameraNo) {
  if (isCameraPlaying(cameraNo)) return 'success'

  const state = getCameraState(cameraNo)
  if (state.status === 'loading') return 'warning'
  if (state.status === 'failed') return 'danger'
  return 'info'
}

function isCameraPlaying(cameraNo) {
  return slotCameras.value.some((camera, index) => camera?.cameraNo === cameraNo && !!videoUrls.value[index])
}

function getSlotPlaceholder(index) {
  const camera = slotCameras.value[index]
  if (!camera) return '请选择左侧摄像头'

  const state = getCameraState(camera.cameraNo)
  if (state.status === 'failed') return state.message || '播放地址获取失败'
  if (state.status === 'loading') return '正在请求播放地址'
  return camera.cameraNo
}

function isSuccessResponse(res) {
  const code = res?.code
  return code === 0 || code === '0' || code === 200 || code === '200'
}

function clearPlayer(index) {
  const nextUrls = [...videoUrls.value]
  const nextSlotCameras = [...slotCameras.value]
  nextUrls[index] = ''
  nextSlotCameras[index] = null
  videoUrls.value = nextUrls
  slotCameras.value = nextSlotCameras
}

function clearCurrent() {
  if (!activeUrl.value && !activeCamera.value) return
  clearPlayer(activeIndex.value)
}

function clearAll() {
  resetPlayers()
}

function clearLegacyPlayCache() {
  localStorage.removeItem(LEGACY_URLS_KEY)
  localStorage.removeItem(LEGACY_PLAY_DATA_KEY)
}

function clampBatchStart() {
  batchStartIndex.value = Math.min(batchStartIndex.value, maxBatchStart())
}

function maxBatchStart() {
  return Math.max(0, filteredCameraList.value.length - 1)
}

function handlePlayerError(error) {
  console.error('[VideoLive2] player error:', error)
}

function handlePlayerTimeout(index) {
  console.warn(`[VideoLive2] player ${index + 1} timeout`)
}
</script>

<style lang="scss" scoped>
.video-live-page {
  min-height: calc(100vh - 84px);
}

.video-live-page :deep(.splitpanes__pane) {
  min-width: 0;
}

.video-live-tree-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.video-live-camera-tools {
  margin-bottom: 12px;
}

.video-live-camera-summary {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.video-live-tree-panel {
  height: calc(100vh - 208px);
  overflow: auto;
}

.video-live-camera-list {
  padding-right: 4px;
}

.video-live-camera-item {
  width: 100%;
  min-height: 86px;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  text-align: left;
  cursor: pointer;
}

.video-live-camera-item:hover,
.video-live-camera-item.is-active {
  border-color: var(--el-color-primary);
}

.video-live-camera-item.is-playing {
  background: var(--el-color-primary-light-9);
}

.video-live-camera-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
}

.video-live-camera-item__top span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-live-camera-item__no {
  margin-top: 6px;
  color: var(--el-color-primary);
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
}

.video-live-camera-item__address {
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.video-live-player {
  height: calc(100vh - 236px);
  min-height: 520px;
  padding: 10px;
  background: #141414;
}

.video-live-grid {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 8px;
}

.video-live-grid.is-split-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.video-live-grid.is-split-4 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.video-live-grid.is-split-9 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
}

.video-live-grid__cell {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 2px solid #3b3b3b;
  background: #000;
}

.video-live-grid__cell.is-active {
  border-color: var(--el-color-primary);
}

.video-live-slot-title {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  max-width: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 5px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.56);
  color: #fff;
  pointer-events: none;
}

.video-live-slot-title span,
.video-live-slot-title small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-live-slot-title span {
  font-size: 13px;
  font-weight: 600;
}

.video-live-slot-title small {
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
  opacity: 0.82;
}

.video-live-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.video-live-empty span {
  font-size: 30px;
  font-weight: 600;
}

.video-live-empty small {
  max-width: 240px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
