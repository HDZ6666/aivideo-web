<template>
    <div class="jessibuca-player" ref="containerRef">
        <!-- 播放器容器，Jessibuca 会自动填充 -->
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Props
const props = defineProps({
    // 视频流地址
    videoUrl: {
        type: String,
        default: ''
    },
    // 是否自动播放
    autoPlay: {
        type: Boolean,
        default: true
    },
    // 是否静音
    muted: {
        type: Boolean,
        default: true
    },
    // 缓冲时长（秒）
    videoBuffer: {
        type: Number,
        default: 0.2
    },
    // 是否使用 MediaSource
    useMSE: {
        type: Boolean,
        default: true
    },
    // 是否使用 WebCodecs
    useWCS: {
        type: Boolean,
        default: false
    },
    // 是否显示操作按钮
    showOperateBtns: {
        type: Boolean,
        default: false
    },
    // 是否显示网速
    showBandwidth: {
        type: Boolean,
        default: false
    },
    // 加载中文本
    loadingText: {
        type: String,
        default: '加载中...'
    },
    // 超时时间（秒）
    timeout: {
        type: Number,
        default: 10
    },
    // 是否调试模式
    debug: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['play', 'pause', 'error', 'timeout', 'load', 'fullscreen', 'videoInfo', 'audioInfo'])

// Refs
const containerRef = ref(null)
let jessibuca = null

// 状态
const playing = ref(false)
const loaded = ref(false)

// 创建播放器
const createPlayer = () => {
    if (!containerRef.value) return
    if (!window.Jessibuca) {
        console.error('Jessibuca 未加载，请确保在 index.html 中引入 jessibuca.js')
        return
    }

    jessibuca = new window.Jessibuca({
        container: containerRef.value,
        videoBuffer: props.videoBuffer,
        isResize: false,
        useWCS: props.useWCS,
        useMSE: props.useMSE,
        text: '',
        loadingText: props.loadingText,
        debug: props.debug,
        supportDblclickFullscreen: true,
        showBandwidth: props.showBandwidth,
        operateBtns: {
            fullscreen: props.showOperateBtns,
            screenshot: props.showOperateBtns,
            play: props.showOperateBtns,
            audio: props.showOperateBtns,
        },
        forceNoOffscreen: true,
        isNotMute: !props.muted,
        timeout: props.timeout
    })

    // 绑定事件
    jessibuca.on('load', () => {
        console.log('[JessibucaPlayer] on load')
        emit('load')
    })

    jessibuca.on('play', () => {
        console.log('[JessibucaPlayer] on play')
        playing.value = true
        loaded.value = true
        emit('play')
    })

    jessibuca.on('pause', () => {
        console.log('[JessibucaPlayer] on pause')
        playing.value = false
        emit('pause')
    })

    jessibuca.on('error', (error) => {
        console.error('[JessibucaPlayer] error:', error)
        emit('error', error)
    })

    jessibuca.on('timeout', () => {
        console.warn('[JessibucaPlayer] timeout')
        emit('timeout')
    })

    jessibuca.on('fullscreen', (isFullscreen) => {
        console.log('[JessibucaPlayer] fullscreen:', isFullscreen)
        emit('fullscreen', isFullscreen)
    })

    jessibuca.on('videoInfo', (info) => {
        console.log('[JessibucaPlayer] videoInfo:', info)
        emit('videoInfo', info)
    })

    jessibuca.on('audioInfo', (info) => {
        console.log('[JessibucaPlayer] audioInfo:', info)
        emit('audioInfo', info)
    })
}

// 播放
const play = (url) => {
    const playUrl = url || props.videoUrl
    if (jessibuca && playUrl) {
        jessibuca.play(playUrl)
    }
}

// 暂停
const pause = () => {
    if (jessibuca) {
        jessibuca.pause()
        playing.value = false
    }
}

// 停止并销毁
const destroy = async () => {
    if (jessibuca) {
        await jessibuca.destroy()
        jessibuca = null
        playing.value = false
        loaded.value = false
    }
}

// 静音
const mute = () => {
    if (jessibuca) {
        jessibuca.mute()
    }
}

// 取消静音
const cancelMute = () => {
    if (jessibuca) {
        jessibuca.cancelMute()
    }
}

// 全屏
const fullscreen = () => {
    if (jessibuca) {
        jessibuca.setFullscreen(true)
    }
}

// 截图
const screenshot = () => {
    if (jessibuca) {
        jessibuca.screenshot()
    }
}

// 设置音量 (0-1)
const setVolume = (volume) => {
    if (jessibuca) {
        jessibuca.setVolume(volume)
    }
}

// 清屏
const clearView = () => {
    if (jessibuca) {
        jessibuca.clearView()
    }
}

// 判断是否静音
const isMuted = () => {
    return jessibuca ? jessibuca.isMute() : true
}

// 判断是否正在播放
const isPlaying = () => {
    return playing.value
}

// 监听 videoUrl 变化
watch(() => props.videoUrl, async (newUrl, oldUrl) => {
    if (newUrl && newUrl !== oldUrl) {
        if (jessibuca) {
            // 如果播放器已存在，先停止再播放新地址
            jessibuca.pause()
            await nextTick()
            jessibuca.play(newUrl)
        }
    }
})

// 生命周期
onMounted(() => {
    createPlayer()
    // 自动播放
    if (props.autoPlay && props.videoUrl) {
        nextTick(() => {
            play()
        })
    }
})

onUnmounted(async () => {
    await destroy()
})

// 暴露方法给父组件
defineExpose({
    play,
    pause,
    destroy,
    mute,
    cancelMute,
    fullscreen,
    screenshot,
    setVolume,
    clearView,
    isMuted,
    isPlaying,
    createPlayer
})
</script>

<style lang="scss" scoped>
.jessibuca-player {
    width: 100%;
    height: 100%;
    background: rgba(13, 14, 27, 0.7);
}
</style>
