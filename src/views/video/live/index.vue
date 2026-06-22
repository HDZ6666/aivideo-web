<template>
  <div class="app-container video-live-page">
    <el-row :gutter="20">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
        <pane size="16">
          <el-col>
            <div class="head-container video-live-tree-head">
              <span>设备列表</span>
              <el-button type="primary" plain size="small" icon="Refresh" @click="refreshTree">刷新</el-button>
            </div>
            <div class="head-container video-live-tree-panel">
              <DeviceTreeNational
                v-if="playerAction === 'national'"
                :key="`national-${treeRenderKey}`"
                @node-click="handleTreeNodeClick"
              />
              <DeviceTreeProxy
                v-if="playerAction === 'proxy'"
                :key="`proxy-${treeRenderKey}`"
                @node-click="handleTreeNodeClick"
              />
              <DeviceTreeNationalCockpit
                v-if="playerAction === 'nationalCockpit'"
                :key="`nationalCockpit-${treeRenderKey}`"
                @node-click="handleTreeNodeClick"
              />
            </div>
          </el-col>
        </pane>

        <pane size="84">
          <el-col>
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="设备类型" prop="playerAction">
                <el-select v-model="queryParams.playerAction" placeholder="请选择设备类型" style="width: 240px">
                  <el-option label="国标设备" value="national" />
                  <el-option label="拉流代理" value="proxy" />
                  <el-option label="国标无层级" value="nationalCockpit" />
                </el-select>
              </el-form-item>
              <el-form-item label="当前窗口">
                <el-tag type="primary">第 {{ activeIndex + 1 }} 窗口</el-tag>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
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
                <el-button type="danger" plain icon="Delete" @click="clearCurrent">清空当前</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="refreshTree"></right-toolbar>
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
                  <StreamPlayer
                    :url="videoUrls[index - 1]"
                    @clear="clearPlayer(index - 1)"
                    @error="handlePlayerError"
                    @timeout="handlePlayerTimeout(index - 1)"
                  >
                    <span>{{ index }}</span>
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
import { computed, onActivated, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import useAppStore from '@/store/modules/app'
import DeviceTreeNational from '@/components/video/DeviceTreeNational/index.vue'
import DeviceTreeProxy from '@/components/video/DeviceTreeProxy/index.vue'
import DeviceTreeNationalCockpit from '@/components/video/DeviceTreeNationalCockpit/index.vue'
import StreamPlayer from '@/components/video/StreamPlayer/index.vue'
import { startDevicePlay } from '@/api/video/play'
import { getNodeBusinessData, isSuccessResponse, pickPlayStartUrl, pickStreamUrl } from '@/utils/video/stream'

const SPLIT_KEY = 'split'
const LEGACY_URLS_KEY = 'videoUrl'
const LEGACY_PLAY_DATA_KEY = 'playData'
const PLAYER_ACTION_KEY = 'playerAction'

const route = useRoute()
const appStore = useAppStore()
const loading = ref(false)
const activeIndex = ref(0)
const showSearch = ref(true)
const queryRef = ref(null)
const treeRenderKey = ref(0)
const videoUrls = ref(createUrlSlots())
const activatedOnce = ref(false)
const queryParams = reactive({
  playerAction: localStorage.getItem(PLAYER_ACTION_KEY) || 'national',
  splitCount: readNumber(SPLIT_KEY, 1)
})

const playerAction = computed({
  get() {
    return queryParams.playerAction
  },
  set(value) {
    queryParams.playerAction = value
  }
})

const splitCount = computed({
  get() {
    return queryParams.splitCount
  },
  set(value) {
    queryParams.splitCount = value
  }
})

const activeUrl = computed(() => videoUrls.value[activeIndex.value] || '')

watch(splitCount, (value) => {
  localStorage.setItem(SPLIT_KEY, String(value))
})

watch(playerAction, (value) => {
  localStorage.setItem(PLAYER_ACTION_KEY, value)
  refreshTree()
})

watch(
  () => route.fullPath,
  () => {
    enterLivePage()
  }
)

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
  videoUrls.value = createUrlSlots()
  activeIndex.value = 0
  clearLegacyPlayCache()
  checkPlayByParam()
}

function readNumber(key, defaultValue) {
  const value = Number(localStorage.getItem(key))
  return [1, 4, 9].includes(value) ? value : defaultValue
}

function createUrlSlots() {
  return Array.from({ length: 9 }, () => '')
}

function refreshTree() {
  treeRenderKey.value += 1
}

function handleQuery() {
  refreshTree()
}

function resetQuery() {
  queryParams.playerAction = 'national'
  setSplit(1)
  refreshTree()
}

function setSplit(value) {
  splitCount.value = value
  activeIndex.value = 0
}

async function handleTreeNodeClick(nodeData) {
  const businessData = getNodeBusinessData(nodeData)

  if (playerAction.value === 'national') {
    await playNationalChannel(businessData)
    return
  }

  const streamInfo = businessData.streamInfo || businessData.aiStreamInfo || businessData
  const streamUrl = pickStreamUrl(streamInfo)
  if (streamUrl) {
    setPlayUrl(streamUrl, activeIndex.value)
    return
  }

  if (businessData.deviceId && businessData.channelId) {
    await playNationalChannel(businessData)
    return
  }

  ElMessage.error('播放失败，未找到可用播放地址')
}

async function playNationalChannel(channel) {
  const deviceId = channel.deviceId
  const channelId = channel.channelId

  if (!deviceId || !channelId) {
    ElMessage.error('播放失败，设备或通道编号缺失')
    return
  }

  loading.value = true
  try {
    const res = await startDevicePlay(deviceId, channelId)
    if (isSuccessResponse(res) && res.data) {
      const url = pickPlayStartUrl(res.data)
      if (!url) {
        ElMessage.error('播放失败，接口未返回可用播放地址')
        return
      }
      channel.playUrl = url
      setPlayUrl(url, activeIndex.value)
    } else {
      ElMessage.error(res?.msg || '播放失败')
    }
  } finally {
    loading.value = false
  }
}

function setPlayUrl(url, index) {
  videoUrls.value[index] = url
}

function clearPlayer(index) {
  videoUrls.value[index] = ''
}

function clearCurrent() {
  if (!activeUrl.value) return
  clearPlayer(activeIndex.value)
}

function clearLegacyPlayCache() {
  localStorage.removeItem(LEGACY_URLS_KEY)
  localStorage.removeItem(LEGACY_PLAY_DATA_KEY)
}

function checkPlayByParam() {
  const { deviceId, channelId } = route.query
  if (deviceId && channelId) {
    playNationalChannel({ deviceId, channelId })
  }
}

function handlePlayerError(error) {
  console.error('[VideoLive] player error:', error)
}

function handlePlayerTimeout(index) {
  console.warn(`[VideoLive] player ${index + 1} timeout`)
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
  margin-bottom: 20px;
}

.video-live-tree-panel {
  height: calc(100vh - 190px);
  overflow: auto;
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
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 2px solid #3b3b3b;
  background: #000;
}

.video-live-grid__cell.is-active {
  border-color: var(--el-color-primary);
}
</style>
