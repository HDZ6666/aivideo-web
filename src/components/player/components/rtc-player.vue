<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue'

// 定义组件 props
interface Props {
  src: string // WebRTC 视频流 URL
  iceServers?: RTCIceServer[] // ICE 服务器配置
}

const props = withDefaults(defineProps<Props>(), {
  iceServers: () => [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
})

// 定义组件事件
const emit = defineEmits<{
  ready: [] // 播放器准备就绪
  error: [error: any] // 播放错误
}>()

// WebRTC 相关实例
let peerConnection: RTCPeerConnection | null = null
let websocket: WebSocket | null = null

// 初始化 WebRTC 播放器
function initPlayer() {
  // 使用原生 DOM 获取 video（uni-h5 会把 <video> 包一层 <uni-video>），优先取内部真正的 <video>
  let video = document.querySelector('#rtcPlayer video') as HTMLVideoElement
  if (!video) {
    video = document.querySelector('video#rtcPlayer') as HTMLVideoElement || document.getElementById('rtcPlayer') as HTMLVideoElement
  }
  if (!video) {
    emit('error', new Error('找不到视频元素'))
    return
  }

  console.log('初始化 WebRTC 播放器')
  console.log('WebRTC URL:', props.src)

  try {
    // 创建 RTCPeerConnection
    peerConnection = new RTCPeerConnection({
      iceServers: props.iceServers,
    })

    // 监听远程流
    peerConnection.ontrack = (event) => {
      console.log('收到远程流')
      if (event.streams && event.streams[0]) {
        video.srcObject = event.streams[0]
        video.play().catch((error) => {
          console.log('自动播放失败:', error)
        })
        emit('ready')
      }
    }

    // 监听 ICE 候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
        }))
      }
    }

    // 监听连接状态变化
    peerConnection.onconnectionstatechange = () => {
      console.log('连接状态:', peerConnection?.connectionState)
      if (peerConnection?.connectionState === 'failed') {
        emit('error', new Error('WebRTC 连接失败'))
      }
    }

    // 建立 WebSocket 连接进行信令交换
    connectWebSocket()
  }
  catch (error) {
    console.error('WebRTC 初始化失败:', error)
    emit('error', error)
  }
}

// 建立 WebSocket 连接
function connectWebSocket() {
  try {
    // 将 HTTP/HTTPS URL 转换为 WebSocket URL
    const wsUrl = props.src.replace(/^http/, 'ws')
    websocket = new WebSocket(wsUrl)

    websocket.onopen = () => {
      console.log('WebSocket 连接已建立')
      // 发送播放请求
      websocket?.send(JSON.stringify({
        type: 'play',
        streamUrl: props.src,
      }))
    }

    websocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data)
        await handleSignalingMessage(message)
      }
      catch (error) {
        console.error('处理信令消息失败:', error)
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket 错误:', error)
      emit('error', new Error('WebSocket 连接错误'))
    }

    websocket.onclose = () => {
      console.log('WebSocket 连接已关闭')
    }
  }
  catch (error) {
    console.error('WebSocket 连接失败:', error)
    emit('error', error)
  }
}

// 处理信令消息
async function handleSignalingMessage(message: any) {
  if (!peerConnection)
    return

  switch (message.type) {
    case 'offer':
    { await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'answer',
          answer,
        }))
      }
      break }

    case 'ice-candidate':
      if (message.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate))
      }
      break

    default:
      console.log('未知信令消息类型:', message.type)
  }
}

// 清理资源
function cleanup() {
  if (peerConnection) {
    peerConnection.close()
    peerConnection = null
  }

  if (websocket) {
    websocket.close()
    websocket = null
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
  // 页面卸载时清理资源，避免内存泄漏
  cleanup()
})

// 监听 src 变化，重新初始化播放器
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    cleanup()
    setTimeout(() => {
      initPlayer()
    }, 100)
  }
})
</script>

<template>
  <video
    id="rtcPlayer"
    class="rtc-player"
    controls
    muted
    playsinline
    webkit-playsinline
    x5-playsinline
    x-webkit-airplay="allow"
    preload="auto"
  />
</template>

<style scoped>
.rtc-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}
</style>
