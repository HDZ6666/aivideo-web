<script setup lang="ts">
import Hls from 'hls.js'
import { nextTick, onMounted, onUnmounted, watch } from 'vue'

// 定义组件 props
interface Props {
  src: string // HLS 视频流 URL
}

const props = defineProps<Props>()

// 定义组件事件
const emit = defineEmits<{
  ready: [] // 播放器准备就绪
  error: [error: any] // 播放错误
}>()

// Hls 实例
let hls: Hls | null = null

// 初始化 HLS 播放器（参考 hls-demo2 的简洁实现）
function initPlayer() {
  // 使用原生 DOM 获取 video（uni-h5 会把 <video> 包一层 <uni-video>），优先取内部真正的 <video>
  let video = document.querySelector('#hlsPlayer video') as HTMLVideoElement
  if (!video) {
    video = document.querySelector('video#hlsPlayer') as HTMLVideoElement || document.getElementById('hlsPlayer') as HTMLVideoElement
  }
  if (!video) {
    emit('error', new Error('找不到视频元素'))
    return
  }

  // 为跨域媒体设置 crossorigin（有些源需要）
  video.setAttribute('crossorigin', 'anonymous')
  const url = props.src

  console.log('video:', video.canPlayType('application/vnd.apple.mpegurl'))

  // 如浏览器原生支持 HLS（iOS Safari 等）
  if (typeof video.canPlayType === 'function' && video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
    video.load()
    video.addEventListener('canplay', () => {
      if (typeof video.play === 'function') {
        video.play().catch(() => {})
      }
    }, { once: true })
    emit('ready')
  }
  else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
    // 使用 hls.js 播放
    hls = new Hls({
      // 可按需调整配置，如：maxBufferLength、xhrSetup 等
    })
    hls.loadSource(url)
    hls.attachMedia(video)
    // 清单解析完成后再调用播放，避免无源播放报错
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (typeof video.play === 'function') {
        video.play().catch(() => {})
      }
    })
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS 播放错误：', data)
      emit('error', data)
    })
    emit('ready')
  }
  else {
    // 兜底：直接设置 src，交由浏览器自行判定
    video.src = url
    video.load()
    emit('error', new Error('浏览器不支持 HLS 播放'))
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    // 宏任务后再取，确保节点已插入
    setTimeout(() => {
      initPlayer()
    }, 0)
  })
})

onUnmounted(() => {
  // 页面卸载时释放 hls 实例，避免内存泄漏
  if (hls) {
    hls.destroy()
    hls = null
  }
})

// 监听 src 变化，重新初始化播放器
watch(() => props.src, (newSrc) => {
  if (newSrc && hls) {
    hls.loadSource(newSrc)
  }
  else if (newSrc) {
    initPlayer()
  }
})
</script>

<template>
  <video
    id="hlsPlayer"
    class="hls-player"

    controls x5-playsinline muted webkit-playsinline playsinline
    x-webkit-airplay="allow"
    preload="auto"
  />
</template>

<style scoped>
.hls-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}
</style>
