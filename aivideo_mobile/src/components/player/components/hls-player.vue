<script setup lang="ts">
import Hls from 'hls.js'
import { nextTick, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string // 视频 URL，支持 HLS (.m3u8) 和普通视频格式 (MP4, WebM 等)
}

const props = defineProps<Props>()

// 定义组件事件
const emit = defineEmits<{
  ready: [] // 播放器准备就绪
  error: [error: any] // 播放错误
}>()

let hls: Hls | null = null

/**
 * 检测视频格式类型
 * @param url 视频 URL
 * @returns 视频格式类型
 */
function detectVideoType(url: string): 'hls' | 'native' {
  const lowerUrl = url.toLowerCase()

  // 检测 HLS 格式
  if (lowerUrl.includes('.m3u8') || lowerUrl.includes('application/vnd.apple.mpegurl')) {
    return 'hls'
  }

  // 其他格式作为原生支持的视频格式处理
  return 'native'
}

/**
 * 初始化 HLS 播放器
 * @param video HTML 视频元素
 * @param url 视频 URL
 */
function initHlsPlayer(video: HTMLVideoElement, url: string) {
  console.log('初始化 HLS 播放器:', url)

  // 检查原生 HLS 支持 (主要是 Safari)
  if (typeof video.canPlayType === 'function' && video.canPlayType('application/vnd.apple.mpegurl')) {
    console.log('使用原生 HLS 支持')
    video.src = url
    video.load()

    video.addEventListener('canplay', () => {
      if (typeof video.play === 'function') {
        video.play().catch((error) => {
          console.warn('自动播放失败:', error)
        })
      }
    }, { once: true })

    video.addEventListener('error', (event) => {
      console.error('原生 HLS 播放错误:', event)
      emit('error', new Error('HLS 视频加载失败'))
    }, { once: true })

    emit('ready')
  }
  // 使用 hls.js
  else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
    console.log('使用 hls.js')
    hls = new Hls({
      // HLS 配置选项
      enableWorker: true,
      lowLatencyMode: false,
    })

    hls.loadSource(url)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('HLS manifest 解析完成')
      if (typeof video.play === 'function') {
        video.play().catch((error) => {
          console.warn('自动播放失败:', error)
        })
      }
    })

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.error('HLS 播放错误:', data)
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            emit('error', new Error('HLS 网络错误，请检查网络连接'))
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            emit('error', new Error('HLS 媒体错误，视频格式可能不支持'))
            break
          default:
            emit('error', new Error('HLS 播放发生致命错误'))
            break
        }
      }
    })

    emit('ready')
  }
  else {
    emit('error', new Error('当前浏览器不支持 HLS 播放，请使用支持 HLS 的浏览器或更新浏览器版本'))
  }
}

/**
 * 初始化原生视频播放器
 * @param video HTML 视频元素
 * @param url 视频 URL
 */
function initNativePlayer(video: HTMLVideoElement, url: string) {
  console.log('初始化原生视频播放器:', url)

  video.src = url
  video.load()

  // 监听视频可以播放事件
  video.addEventListener('canplay', () => {
    console.log('原生视频可以播放')
    if (typeof video.play === 'function') {
      video.play().catch((error) => {
        console.warn('自动播放失败:', error)
      })
    }
  }, { once: true })

  // 监听视频加载完成事件
  video.addEventListener('loadedmetadata', () => {
    console.log('原生视频元数据加载完成')
    emit('ready')
  }, { once: true })

  // 监听视频错误事件
  video.addEventListener('error', (event) => {
    console.error('原生视频播放错误:', event)
    const error = video.error
    let errorMessage = '视频播放失败'

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = '视频播放被中止'
          break
        case error.MEDIA_ERR_NETWORK:
          errorMessage = '网络错误导致视频下载失败'
          break
        case error.MEDIA_ERR_DECODE:
          errorMessage = '视频解码失败'
          break
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = '视频格式不支持或视频文件损坏'
          break
        default:
          errorMessage = '未知的视频播放错误'
          break
      }
    }

    emit('error', new Error(errorMessage))
  }, { once: true })
}

function initPlayer() {
  let video = document.querySelector('#hlsPlayer video') as HTMLVideoElement
  if (!video) {
    video = document.querySelector('video#hlsPlayer') as HTMLVideoElement || document.getElementById('hlsPlayer') as HTMLVideoElement
  }
  if (!video) {
    emit('error', new Error('找不到视频元素'))
    return
  }

  // 设置视频元素属性
  video.setAttribute('crossorigin', 'anonymous')

  const url = props.src
  if (!url) {
    emit('error', new Error('视频 URL 不能为空'))
    return
  }

  // 检测视频格式并选择合适的播放方式
  const videoType = detectVideoType(url)
  console.log('检测到视频格式:', videoType, 'URL:', url)

  // 清理之前的播放器实例
  if (hls) {
    hls.destroy()
    hls = null
  }

  // 根据视频格式初始化对应的播放器
  if (videoType === 'hls') {
    initHlsPlayer(video, url)
  }
  else {
    initNativePlayer(video, url)
  }
}

onMounted(() => {
  nextTick(() => {
    initPlayer()
  })
})

onUnmounted(() => {
  // 清理 HLS 播放器实例
  if (hls) {
    hls.destroy()
    hls = null
  }

  // 清理视频元素事件监听器
  const video = document.getElementById('hlsPlayer') as HTMLVideoElement
  if (video) {
    video.removeAttribute('src')
    video.load()
  }
})

watch(() => props.src, (newSrc, oldSrc) => {
  // 如果新的 URL 为空，不进行任何操作
  if (!newSrc) {
    return
  }

  // 如果 URL 没有变化，不重新初始化
  if (newSrc === oldSrc) {
    return
  }

  console.log('视频 URL 发生变化:', oldSrc, '->', newSrc)

  // 检测新 URL 的格式类型
  const newVideoType = detectVideoType(newSrc)
  const oldVideoType = oldSrc ? detectVideoType(oldSrc) : null

  // 如果都是 HLS 格式且 hls 实例存在，只需要更换源
  if (newVideoType === 'hls' && oldVideoType === 'hls' && hls) {
    console.log('更换 HLS 视频源')
    hls.loadSource(newSrc)
  }
  else {
    // 其他情况重新初始化播放器
    console.log('重新初始化播放器')
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
