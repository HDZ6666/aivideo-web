<template>
  <el-dialog
    v-model="open"
    title="视频播放"
    width="860px"
    top="0"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <div v-loading="loading" class="device-player">
      <el-tabs v-model="activePlayer" type="card" stretch @tab-change="changePlayer">
        <el-tab-pane label="LivePlayer" name="livePlayer">
          <div class="player-stage">
            <div ref="livePlayerHostRef" class="live-player-host"></div>
            <el-empty v-if="activePlayer === 'livePlayer' && !videoUrl" description="暂无播放地址" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Jessibuca" name="jessibuca">
          <div class="player-stage">
            <JessibucaPlayer
              v-if="activePlayer === 'jessibuca' && videoUrl"
              ref="jessibucaRef"
              :video-url="videoUrl"
              :auto-play="true"
              :muted="!hasAudio"
              :has-audio="hasAudio"
              :show-operate-btns="true"
              :show-bandwidth="true"
              :video-buffer="0.1"
              :use-m-s-e="true"
              :use-w-c-s="useWcs"
              loading-text="视频加载中..."
            />
            <el-empty v-else description="暂无播放地址" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="WebRTC" name="webRTC">
          <div class="player-stage">
            <video ref="webRtcVideoRef" class="webrtc-video" controls autoplay playsinline></video>
            <el-empty v-if="activePlayer === 'webRTC' && !videoUrl" description="暂无 WebRTC 播放地址" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="h265web" name="h265web">
          <div class="player-stage player-placeholder">h265web敬请期待</div>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="tabActiveName" class="player-info-tabs" @tab-change="handleInfoTabChange">
        <el-tab-pane label="实时视频" name="media">
          <div class="share-form">
            <div class="share-row">
              <span class="share-label">播放地址：</span>
              <el-input :model-value="sharedInfo.sharedUrl" disabled>
                <template #append>
                  <el-button icon="DocumentCopy" @click="copyText(sharedInfo.sharedUrl)" />
                </template>
              </el-input>
            </div>
            <div class="share-row">
              <span class="share-label">iframe：</span>
              <el-input :model-value="sharedInfo.sharedIframe" disabled>
                <template #append>
                  <el-button icon="DocumentCopy" @click="copyText(sharedInfo.sharedIframe)" />
                </template>
              </el-input>
            </div>
            <div class="share-row">
              <span class="share-label">资源地址：</span>
              <el-input :model-value="sharedInfo.sharedRtmp" disabled>
                <template #prepend>
                  <el-dropdown trigger="click" max-height="260px" @command="copyText">
                    <el-button>
                      更多地址
                      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-for="item in streamUrlOptions" :key="item.key" :command="item.value">
                          <el-tag size="small">{{ item.label }}</el-tag>
                          <span class="stream-url-item">{{ item.value }}</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
                <template #append>
                  <el-button icon="DocumentCopy" @click="copyText(sharedInfo.sharedRtmp)" />
                </template>
              </el-input>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="showPtz" label="云台控制" name="control">
          <div class="ptz-panel">
            <div class="control-wrapper">
              <button class="control-btn control-top" @mousedown="ptzCamera('up')" @mouseup="ptzCamera('stop')" @mouseleave="ptzCamera('stop')">
                <el-icon><CaretTop /></el-icon>
                <span class="control-inner-btn control-inner"></span>
              </button>
              <button class="control-btn control-left" @mousedown="ptzCamera('left')" @mouseup="ptzCamera('stop')" @mouseleave="ptzCamera('stop')">
                <el-icon><CaretLeft /></el-icon>
                <span class="control-inner-btn control-inner"></span>
              </button>
              <button class="control-btn control-bottom" @mousedown="ptzCamera('down')" @mouseup="ptzCamera('stop')" @mouseleave="ptzCamera('stop')">
                <el-icon><CaretBottom /></el-icon>
                <span class="control-inner-btn control-inner"></span>
              </button>
              <button class="control-btn control-right" @mousedown="ptzCamera('right')" @mouseup="ptzCamera('stop')" @mouseleave="ptzCamera('stop')">
                <el-icon><CaretRight /></el-icon>
                <span class="control-inner-btn control-inner"></span>
              </button>
              <div class="control-round">
                <button class="control-round-inner" @click="ptzCamera('stop')" aria-label="停止云台">
                  <span class="control-pause-icon"></span>
                </button>
              </div>
              <button class="control-zoom-btn zoom-in" @mousedown="ptzCamera('zoomin')" @mouseup="ptzCamera('stop')" @mouseleave="ptzCamera('stop')">
                <el-icon><ZoomIn /></el-icon>
              </button>
              <button class="control-zoom-btn zoom-out" @mousedown="ptzCamera('zoomout')" @mouseup="ptzCamera('stop')" @mouseleave="ptzCamera('stop')">
                <el-icon><ZoomOut /></el-icon>
              </button>
              <div class="control-speed">
                <el-slider v-model="controlSpeed" :max="255" />
              </div>
            </div>

            <div class="control-panel">
              <el-tag class="ptz-label ptz-label-preset" size="large">预置位编号</el-tag>
              <el-input-number class="ptz-number ptz-number-preset" v-model="presetPos" size="small" controls-position="right" :precision="0" :step="1" :min="1" :max="255" />
              <el-button class="ptz-action ptz-action-preset-set" size="small" icon="AddLocation" @click="presetPosition(129, presetPos)">设置</el-button>
              <el-button class="ptz-action ptz-action-preset-delete" size="small" icon="DeleteLocation" @click="presetPosition(131, presetPos)">删除</el-button>
              <el-button class="ptz-action ptz-action-preset-call" size="small" type="primary" icon="Place" @click="presetPosition(130, presetPos)">调用</el-button>

              <el-tag class="ptz-label ptz-label-cruise-speed" size="large">巡航速度</el-tag>
              <el-input-number class="ptz-number ptz-number-cruise-speed" v-model="cruisingSpeed" size="small" controls-position="right" :precision="0" :min="1" :max="4095" />
              <el-button class="ptz-action ptz-action-cruise-speed" size="small" icon="Loading" @click="setSpeedOrTime(134, cruisingGroup, cruisingSpeed)">设置</el-button>
              <el-tag class="ptz-label ptz-label-cruise-time" size="large">停留时间</el-tag>
              <el-input-number class="ptz-number ptz-number-cruise-time" v-model="cruisingTime" size="small" controls-position="right" :precision="0" :min="1" :max="4095" />
              <el-button class="ptz-action ptz-action-cruise-time" size="small" icon="Timer" @click="setSpeedOrTime(135, cruisingGroup, cruisingTime)">设置</el-button>

              <el-tag class="ptz-label ptz-label-cruise-group" size="large">巡航组编号</el-tag>
              <el-input-number class="ptz-number ptz-number-cruise-group" v-model="cruisingGroup" size="small" controls-position="right" :precision="0" :min="0" :max="255" />
              <el-button class="ptz-action ptz-action-cruise-add" size="small" icon="AddLocation" @click="setCommand(132, cruisingGroup, presetPos)">添加点</el-button>
              <el-button class="ptz-action ptz-action-cruise-delete" size="small" icon="DeleteLocation" @click="setCommand(133, cruisingGroup, presetPos)">删除点</el-button>
              <el-button class="ptz-action ptz-action-cruise-delete-group" size="small" icon="Delete" @click="setCommand(133, cruisingGroup, 0)">删除组</el-button>
              <el-button class="ptz-action ptz-action-cruise-start" size="small" type="primary" icon="VideoCameraFilled" @click="setCommand(136, cruisingGroup, 0)">巡航</el-button>

              <el-tag class="ptz-label ptz-label-scan-speed" size="large">扫描速度</el-tag>
              <el-input-number class="ptz-number ptz-number-scan-speed" v-model="scanSpeed" size="small" controls-position="right" :precision="0" :min="1" :max="4095" />
              <el-button class="ptz-action ptz-action-scan-speed" size="small" icon="Loading" @click="setSpeedOrTime(138, scanGroup, scanSpeed)">设置</el-button>
              <el-button class="ptz-action ptz-action-scan-start" size="small" type="primary" icon="VideoCameraFilled" @click="setCommand(137, scanGroup, 0)">扫描</el-button>

              <el-tag class="ptz-label ptz-label-scan-group" size="large">扫描组编号</el-tag>
              <el-input-number class="ptz-number ptz-number-scan-group" v-model="scanGroup" size="small" controls-position="right" :precision="0" :step="1" :min="0" :max="255" />
              <el-button class="ptz-action ptz-action-scan-left" size="small" icon="DArrowLeft" @click="setCommand(137, scanGroup, 1)">左边界</el-button>
              <el-button class="ptz-action ptz-action-scan-right" size="small" icon="DArrowRight" @click="setCommand(137, scanGroup, 2)">右边界</el-button>
              <el-button class="ptz-action ptz-action-scan-stop" size="small" type="danger" icon="SwitchButton" @click="ptzCamera('stop')">停止</el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="编码信息" name="codec">
          <div v-loading="tracksLoading" class="codec-panel">
            <p>
              无法播放或者没有声音？试一试
              <el-button v-if="!coverPlaying" size="small" type="primary" @click="coverPlay">转码播放</el-button>
              <el-button v-else size="small" type="danger" @click="convertStopClick">停止转码</el-button>
            </p>
            <el-empty v-if="tracksNotLoaded" description="暂无数据" />
            <el-row v-else :gutter="12">
              <el-col v-for="(item, index) in tracks" :key="index" :span="12">
                <el-descriptions :title="`流 ${index}`" :column="1" border size="small">
                  <el-descriptions-item label="格式">{{ item.codec_id_name || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="类型">{{ item.codec_type === 0 ? '视频' : '音频' }}</el-descriptions-item>
                  <el-descriptions-item v-if="item.codec_type === 0" label="分辨率">{{ item.width }} x {{ item.height }}</el-descriptions-item>
                  <el-descriptions-item v-if="item.codec_type === 0" label="帧率">{{ item.fps }}</el-descriptions-item>
                  <el-descriptions-item v-if="item.codec_type === 1" label="采样位数">{{ item.sample_bit }}</el-descriptions-item>
                  <el-descriptions-item v-if="item.codec_type === 1" label="采样率">{{ item.sample_rate }}</el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import {
  ArrowDown,
  CaretBottom,
  CaretLeft,
  CaretRight,
  CaretTop,
  ZoomIn,
  ZoomOut
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import JessibucaPlayer from '@/components/player/JessibucaPlayer.vue'
import request from '@/utils/video/request'

const PLAYER_CONFIG = {
  livePlayer: ['ws_flv', 'wss_flv'],
  jessibuca: ['ws_flv', 'wss_flv'],
  webRTC: ['rtc', 'rtcs']
}

const STREAM_URL_LABELS = [
  ['flv', 'FLV'],
  ['https_flv', 'FLV(https)'],
  ['ws_flv', 'FLV(ws)'],
  ['wss_flv', 'FLV(wss)'],
  ['fmp4', 'FMP4'],
  ['https_fmp4', 'FMP4(https)'],
  ['ws_fmp4', 'FMP4(ws)'],
  ['wss_fmp4', 'FMP4(wss)'],
  ['hls', 'HLS'],
  ['https_hls', 'HLS(https)'],
  ['ws_hls', 'HLS(ws)'],
  ['wss_hls', 'HLS(wss)'],
  ['ts', 'TS'],
  ['https_ts', 'TS(https)'],
  ['ws_ts', 'TS(ws)'],
  ['wss_ts', 'TS(wss)'],
  ['rtc', 'RTC'],
  ['rtcs', 'RTCS'],
  ['rtmp', 'RTMP'],
  ['rtmps', 'RTMPS'],
  ['rtsp', 'RTSP'],
  ['rtsps', 'RTSPS']
]

const open = ref(false)
const loading = ref(false)
const activePlayer = ref('jessibuca')
const tabActiveName = ref('media')
const videoUrl = ref('')
const hasAudio = ref(false)
const streamInfo = ref(null)
const streamId = ref('')
const app = ref('')
const mediaServerId = ref('')
const deviceId = ref('')
const channelId = ref('')
const showPtz = ref(true)
const convertKey = ref('')
const coverPlaying = ref(false)
const tracks = ref([])
const tracksLoading = ref(false)
const tracksNotLoaded = ref(false)
const controlSpeed = ref(30)
const presetPos = ref(1)
const cruisingSpeed = ref(100)
const cruisingTime = ref(5)
const cruisingGroup = ref(0)
const scanSpeed = ref(100)
const scanGroup = ref(0)
const livePlayerHostRef = ref(null)
const jessibucaRef = ref(null)
const webRtcVideoRef = ref(null)

let livePlayerEl = null
let webRtcPlayer = null
let livePlayerScriptPromise = null
let zlmRtcScriptPromise = null

const sharedInfo = computed(() => ({
  sharedUrl: videoUrl.value ? window.location.origin + encodeURIComponent(videoUrl.value) : '',
  sharedIframe: videoUrl.value ? `<iframe src="${window.location.origin + encodeURIComponent(videoUrl.value)}"></iframe>` : '',
  sharedRtmp: videoUrl.value
}))

const useWcs = computed(() => window.location.hostname === 'localhost' || window.location.protocol === 'https:')

const streamUrlOptions = computed(() => {
  if (!streamInfo.value) return []
  return STREAM_URL_LABELS.map(([key, label]) => ({
    key,
    label,
    value: getStreamValue(streamInfo.value, key)
  })).filter((item) => item.value)
})

function openDialog(type, currentDeviceId, currentChannelId, options = {}) {
  if (open.value) return

  tabActiveName.value = type === 'control' ? 'control' : 'media'
  activePlayer.value = 'jessibuca'
  deviceId.value = currentDeviceId || ''
  channelId.value = currentChannelId || ''
  showPtz.value = type !== 'streamPlay' && !!deviceId.value && !!channelId.value
  tracks.value = []
  tracksNotLoaded.value = false
  streamInfo.value = options.streamInfo || {}
  hasAudio.value = !!options.hasAudio
  streamId.value = streamInfo.value?.stream || ''
  app.value = streamInfo.value?.app || ''
  mediaServerId.value = streamInfo.value?.mediaServerId || ''
  videoUrl.value = getUrlByStreamInfo()
  open.value = true

  nextTick(() => {
    playActivePlayer()
  })
}

async function changePlayer() {
  await stopActivePlayer()
  videoUrl.value = getUrlByStreamInfo()
  await nextTick()
  playActivePlayer()
}

function handleInfoTabChange(name) {
  if (name === 'codec') {
    loadTracks()
  }
}

function getUrlByStreamInfo(playerName = activePlayer.value) {
  const info = streamInfo.value || {}
  const keys = PLAYER_CONFIG[playerName]
  if (!keys) return ''
  const preferredKey = window.location.protocol === 'https:' ? keys[1] : keys[0]
  const fallbackKey = window.location.protocol === 'https:' ? keys[0] : keys[1]
  return getStreamValue(info, preferredKey) || getStreamValue(info, fallbackKey) || ''
}

function getStreamValue(info, key) {
  const value = info?.[key] || info?.[key?.toUpperCase?.()]
  if (!value) return ''
  return typeof value === 'object' ? value.url || '' : value
}

async function playActivePlayer() {
  if (!open.value || !videoUrl.value) return
  if (activePlayer.value === 'livePlayer') {
    await mountLivePlayer()
  }
  if (activePlayer.value === 'webRTC') {
    await startWebRtc()
  }
}

async function stopActivePlayer() {
  await jessibucaRef.value?.destroy?.()
  destroyLivePlayer()
  stopWebRtc()
}

async function mountLivePlayer() {
  const host = livePlayerHostRef.value
  if (!host) return
  host.innerHTML = ''

  try {
    await ensureLivePlayerScript()
    livePlayerEl = document.createElement('live-player')
    livePlayerEl.setAttribute('video-url', videoUrl.value)
    livePlayerEl.setAttribute('live', 'true')
    livePlayerEl.setAttribute('autoplay', 'true')
    livePlayerEl.setAttribute('fluent', 'true')
    livePlayerEl.setAttribute('stretch', 'true')
    livePlayerEl.setAttribute('aspect', '16:9')
    livePlayerEl.setAttribute('muted', String(!hasAudio.value))
    host.appendChild(livePlayerEl)
  } catch (error) {
    ElMessage.warning('LivePlayer 加载失败，请切换 Jessibuca 播放')
  }
}

function destroyLivePlayer() {
  if (livePlayerEl) {
    livePlayerEl.setAttribute('video-url', '')
    livePlayerEl.remove()
    livePlayerEl = null
  }
  if (livePlayerHostRef.value) {
    livePlayerHostRef.value.innerHTML = ''
  }
}

async function startWebRtc() {
  stopWebRtc()
  if (!webRtcVideoRef.value || !videoUrl.value) return

  try {
    await ensureZlmRtcScript()
    webRtcPlayer = new window.ZLMRTCClient.Endpoint({
      element: webRtcVideoRef.value,
      debug: false,
      zlmsdpUrl: videoUrl.value,
      simulecast: false,
      useCamera: false,
      audioEnable: true,
      videoEnable: true,
      recvOnly: true
    })
    webRtcPlayer.on(window.ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, (event) => {
      if (event?.code === -400 && event?.msg === '流不存在') {
        window.setTimeout(startWebRtc, 300)
      }
    })
  } catch (error) {
    ElMessage.warning('WebRTC 播放器加载失败，请切换 Jessibuca 播放')
  }
}

function stopWebRtc() {
  if (webRtcPlayer) {
    webRtcPlayer.close()
    webRtcPlayer = null
  }
  if (webRtcVideoRef.value) {
    webRtcVideoRef.value.srcObject = null
    webRtcVideoRef.value.removeAttribute('src')
  }
}

function loadTracks() {
  if (!mediaServerId.value || !app.value || !streamId.value) {
    tracks.value = []
    tracksNotLoaded.value = true
    return
  }

  tracks.value = []
  tracksLoading.value = true
  tracksNotLoaded.value = false
  request({
    method: 'get',
    url: `/zlm/${mediaServerId.value}/index/api/getMediaInfo`,
    params: {
      vhost: '__defaultVhost__',
      schema: 'rtsp',
      app: app.value,
      stream: streamId.value
    }
  })
    .then((res) => {
      if (res.code === 0 && res.tracks?.length) {
        tracks.value = res.tracks
      } else {
        tracksNotLoaded.value = true
      }
    })
    .catch(() => {
      tracksNotLoaded.value = true
    })
    .finally(() => {
      tracksLoading.value = false
    })
}

function coverPlay() {
  if (!streamId.value) return
  coverPlaying.value = true
  loading.value = true
  stopActivePlayer()
  request({
    method: 'post',
    url: `/api/play/convert/${streamId.value}`
  })
    .then((res) => {
      convertKey.value = res.key || ''
      streamInfo.value = res.data || streamInfo.value
      videoUrl.value = getUrlByStreamInfo()
      window.setTimeout(playActivePlayer, 1000)
    })
    .catch(() => {
      coverPlaying.value = false
      ElMessage.error('转码失败')
    })
    .finally(() => {
      loading.value = false
    })
}

function convertStopClick() {
  convertStop(() => {
    playActivePlayer()
  })
}

function convertStop(callback) {
  if (!convertKey.value) {
    coverPlaying.value = false
    callback?.()
    return
  }

  request({
    method: 'post',
    url: `/api/play/convertStop/${convertKey.value}`
  }).finally(() => {
    convertKey.value = ''
    coverPlaying.value = false
    callback?.()
  })
}

function ptzCamera(command) {
  if (!deviceId.value || !channelId.value) return
  request({
    method: 'post',
    url: `/api/ptz/control/${deviceId.value}/${channelId.value}`,
    params: {
      command,
      horizonSpeed: controlSpeed.value,
      verticalSpeed: controlSpeed.value,
      zoomSpeed: controlSpeed.value
    }
  })
}

function presetPosition(cmdCode, currentPresetPos) {
  frontEndCommand({
    cmdCode,
    parameter1: 0,
    parameter2: currentPresetPos,
    combindCode2: 0
  })
}

function setSpeedOrTime(cmdCode, groupNum, parameter) {
  frontEndCommand({
    cmdCode,
    parameter1: groupNum,
    parameter2: parameter % 256,
    combindCode2: Math.floor(parameter / 256) * 16
  })
}

function setCommand(cmdCode, groupNum, parameter) {
  frontEndCommand({
    cmdCode,
    parameter1: groupNum,
    parameter2: parameter,
    combindCode2: 0
  })
}

function frontEndCommand(params) {
  if (!deviceId.value || !channelId.value) return
  request({
    method: 'post',
    url: `/api/ptz/front_end_command/${deviceId.value}/${channelId.value}`,
    params
  })
}

async function copyText(text) {
  if (!text) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      fallbackCopyText(text)
    }
    ElMessage.success('成功拷贝到粘贴板')
  } catch (error) {
    try {
      fallbackCopyText(text)
      ElMessage.success('成功拷贝到粘贴板')
    } catch {
      ElMessage.error('复制失败，请手动复制')
    }
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)
  if (!copied) {
    throw new Error('copy failed')
  }
}

function handleClosed() {
  stopActivePlayer()
  videoUrl.value = ''
  tracks.value = []
  tracksNotLoaded.value = false
  if (convertKey.value) {
    convertStop()
  }
}

function close() {
  open.value = false
}

function ensureLivePlayerScript() {
  if (window.customElements?.get?.('live-player')) return Promise.resolve()
  if (!livePlayerScriptPromise) {
    livePlayerScriptPromise = loadScript(withBase('/static/js/liveplayer-element.min.js'))
  }
  return livePlayerScriptPromise
}

function ensureZlmRtcScript() {
  if (window.ZLMRTCClient) return Promise.resolve()
  if (!zlmRtcScriptPromise) {
    zlmRtcScriptPromise = loadScript(withBase('/static/js/ZLMRTCClient.js'))
  }
  return zlmRtcScriptPromise
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existed = document.querySelector(`script[src="${src}"]`)
    if (existed) {
      existed.addEventListener('load', resolve, { once: true })
      existed.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function withBase(path) {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return normalizedBase + path.replace(/^\/+/, '')
}

defineExpose({
  openDialog,
  close
})
</script>

<style scoped>
.device-player {
  width: 100%;
}

.player-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 360px;
  background: #000;
  overflow: hidden;
}

.live-player-host,
.live-player-host :deep(live-player),
.webrtc-video {
  width: 100%;
  height: 100%;
  display: block;
  background: #000;
}

.player-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dcdfe6;
  font-size: 16px;
}

.player-info-tabs {
  margin-top: 12px;
}

.share-form {
  padding: 4px 0;
}

.share-row {
  display: flex;
  align-items: center;
  height: 38px;
  margin-bottom: 8px;
}

.share-label {
  width: 78px;
  text-align: right;
  margin-right: 8px;
  color: #606266;
}

.stream-url-item {
  display: inline-block;
  max-width: 620px;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.ptz-panel {
  display: flex;
  justify-content: flex-start;
  min-height: 190px;
  align-items: flex-start;
}

.control-wrapper {
  position: relative;
  width: 6.25rem;
  height: 6.25rem;
  max-width: 6.25rem;
  max-height: 6.25rem;
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  border-radius: 100%;
  flex: 0 0 6.25rem;
}

.control-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 44%;
  height: 44%;
  padding: 0;
  border: 1px solid #78aee4;
  border-radius: 5px;
  box-sizing: border-box;
  background: #fff;
  color: #78aee4;
  cursor: pointer;
  transition: all 0.3s linear;
}

.control-btn:hover {
  background: #ecf5ff;
}

.control-btn .el-icon {
  z-index: 2;
  font-size: 20px;
  color: #78aee4;
}

.control-inner-btn {
  position: absolute;
  width: 60%;
  height: 60%;
  background: #fafafa;
  pointer-events: none;
}

.control-top {
  top: -8%;
  left: 27%;
  transform: rotate(-45deg);
  border-radius: 5px 100% 5px 0;
}

.control-top .el-icon {
  transform: rotate(45deg);
}

.control-top .control-inner {
  left: -1px;
  bottom: 0;
  border-top: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 100% 0 0;
}

.control-left {
  top: 27%;
  left: -8%;
  transform: rotate(45deg);
  border-radius: 5px 0 5px 100%;
}

.control-left .el-icon {
  transform: rotate(-45deg);
}

.control-left .control-inner {
  right: -1px;
  top: -1px;
  border-bottom: 1px solid #78aee4;
  border-left: 1px solid #78aee4;
  border-radius: 0 0 0 100%;
}

.control-right {
  top: 27%;
  right: -8%;
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
}

.control-right .el-icon {
  transform: rotate(-45deg);
}

.control-right .control-inner {
  left: -1px;
  bottom: -1px;
  border-top: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 100% 0 0;
}

.control-bottom {
  left: 27%;
  bottom: -8%;
  transform: rotate(45deg);
  border-radius: 0 5px 100% 5px;
}

.control-bottom .el-icon {
  transform: rotate(-45deg);
}

.control-bottom .control-inner {
  top: -1px;
  left: -1px;
  border-bottom: 1px solid #78aee4;
  border-right: 1px solid #78aee4;
  border-radius: 0 0 100% 0;
}

.control-round {
  position: absolute;
  top: 21%;
  left: 21%;
  width: 58%;
  height: 58%;
  background: #fff;
  border-radius: 100%;
}

.control-round-inner {
  position: absolute;
  left: 13%;
  top: 13%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 70%;
  padding: 0;
  border: 1px solid #78aee4;
  border-radius: 100%;
  background: #fff;
  color: #78aee4;
  font-size: 40px;
  cursor: pointer;
  transition: all 0.3s linear;
}

.control-round-inner:hover {
  background: #ecf5ff;
}

.control-pause-icon {
  position: relative;
  width: 22px;
  height: 24px;
  border: 4px solid #78aee4;
  border-radius: 50%;
}

.control-pause-icon::before,
.control-pause-icon::after {
  content: '';
  position: absolute;
  top: 5px;
  width: 4px;
  height: 10px;
  background: #78aee4;
}

.control-pause-icon::before {
  left: 5px;
}

.control-pause-icon::after {
  right: 5px;
}

.control-zoom-btn {
  position: absolute;
  left: 7.25rem;
  width: 1.875rem;
  height: 1.875rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: #606266;
  font-size: 1.875rem;
  line-height: 1;
  cursor: pointer;
}

.control-zoom-btn .el-icon {
  font-size: 1.875rem;
}

.zoom-in {
  top: 1.25rem;
}

.zoom-out {
  top: 3.25rem;
}

.control-speed {
  position: absolute;
  left: 4px;
  top: 7rem;
  width: 9rem;
}

.control-panel {
  position: relative;
  top: 0;
  left: 5rem;
  width: 32rem;
  height: 11rem;
  max-height: 11rem;
}

.control-panel :deep(.el-button + .el-button) {
  margin-left: 0;
}

.ptz-label,
.ptz-number,
.ptz-action {
  position: absolute;
}

.ptz-label {
  width: 5rem;
  text-align: center;
}

.ptz-number {
  width: 6rem;
}

.ptz-action {
  width: 5rem;
}

.ptz-label-preset,
.ptz-number-preset,
.ptz-action-preset-set,
.ptz-action-preset-delete,
.ptz-action-preset-call {
  top: 0;
}

.ptz-label-cruise-speed,
.ptz-number-cruise-speed,
.ptz-action-cruise-speed,
.ptz-label-cruise-time,
.ptz-number-cruise-time,
.ptz-action-cruise-time {
  top: 2.5rem;
}

.ptz-label-cruise-group,
.ptz-number-cruise-group,
.ptz-action-cruise-add,
.ptz-action-cruise-delete,
.ptz-action-cruise-delete-group {
  top: 4.5rem;
}

.ptz-action-cruise-start {
  top: 5rem;
}

.ptz-label-scan-speed,
.ptz-number-scan-speed,
.ptz-action-scan-speed,
.ptz-action-scan-start {
  top: 7rem;
}

.ptz-label-scan-group,
.ptz-number-scan-group,
.ptz-action-scan-left,
.ptz-action-scan-right,
.ptz-action-scan-stop {
  top: 9rem;
}

.ptz-label-preset,
.ptz-label-cruise-speed,
.ptz-label-cruise-group,
.ptz-label-scan-speed,
.ptz-label-scan-group {
  left: 0;
}

.ptz-number-preset,
.ptz-number-cruise-speed,
.ptz-number-cruise-group,
.ptz-number-scan-speed,
.ptz-number-scan-group {
  left: 5rem;
}

.ptz-action-preset-set,
.ptz-action-cruise-speed,
.ptz-action-cruise-add,
.ptz-action-scan-speed,
.ptz-action-scan-left {
  left: 11rem;
}

.ptz-action-preset-delete,
.ptz-label-cruise-time,
.ptz-action-cruise-delete,
.ptz-action-scan-right {
  left: 16rem;
}

.ptz-number-cruise-time,
.ptz-action-cruise-delete-group {
  left: 21rem;
}

.ptz-action-preset-call,
.ptz-action-cruise-time,
.ptz-action-cruise-start,
.ptz-action-scan-start,
.ptz-action-scan-stop {
  left: 27rem;
}

.control-panel :deep(.el-input-number .el-input__wrapper) {
  border-radius: 0;
}

.codec-panel {
  min-height: 180px;
  text-align: left;
}
</style>
