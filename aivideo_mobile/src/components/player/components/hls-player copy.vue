<script setup lang="ts">
import Hls from 'hls.js'
import { nextTick, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string // HLS 视频流 URL
}

const props = defineProps<Props>()

// 定义组件事件
const emit = defineEmits<{
  ready: [] // 播放器准备就绪
  error: [error: any] // 播放错误
}>()

let hls: Hls | null = null

function initPlayer() {
  let video = document.querySelector('#hlsPlayer video') as HTMLVideoElement
  if (!video) {
    video = document.querySelector('video#hlsPlayer') as HTMLVideoElement || document.getElementById('hlsPlayer') as HTMLVideoElement
  }
  if (!video) {
    emit('error', new Error('找不到视频元素'))
    return
  }

  video.setAttribute('crossorigin', 'anonymous')
  const url = props.src

  console.log('video:', video.canPlayType('application/vnd.apple.mpegurl'))

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
    hls = new Hls({
    })
    hls.loadSource(url)
    hls.attachMedia(video)
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
    video.src = url
    video.load()
    emit('error', new Error('浏览器不支持 HLS 播放'))
  }
}

onMounted(() => {
  nextTick(() => {
    initPlayer()
  })
})

onUnmounted(() => {
  if (hls) {
    hls.destroy()
    hls = null
  }
})

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
