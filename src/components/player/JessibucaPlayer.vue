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
        // 播放器容器
        container: containerRef.value,

        // 缓冲时长（秒），影响播放延迟
        videoBuffer: props.videoBuffer,

        // 自适应缩放，true 时保持视频原始比例（如 16:9），false 时拉伸填满容器
        isResize: true,

        // 是否使用 WebCodecs 解码（实验性功能，性能更好但兼容性较差）
        useWCS: props.useWCS,

        // 是否使用 MediaSource Extensions 解码（主流方案，兼容性好）
        useMSE: props.useMSE,

        // 水印文本（空字符串表示不显示水印）
        text: '',

        // 加载中显示的文本
        loadingText: props.loadingText,

        // 是否开启调试模式（会在控制台输出详细日志）
        debug: props.debug,

        // 是否支持双击全屏
        supportDblclickFullscreen: true,

        // 是否显示网速信息
        showBandwidth: props.showBandwidth,

        // 操作按钮配置
        operateBtns: {
            fullscreen: props.showOperateBtns,  // 全屏按钮
            screenshot: props.showOperateBtns,  // 截图按钮
            play: props.showOperateBtns,        // 播放/暂停按钮
            audio: props.showOperateBtns,       // 音频按钮
        },

        // 强制不使用 OffscreenCanvas（提高兼容性）
        forceNoOffscreen: true,

        // 是否取消静音（true 表示有声音，false 表示静音）
        isNotMute: !props.muted,

        // 超时时间（秒），超过此时间未收到数据则触发 timeout 事件
        timeout: props.timeout,

        // Decoder 解码器 JS 文件路径
        decoder: '/jessibuca/decoder.js',

        // WebAssembly 解码器文件路径（性能更好）
        wasmDecoder: '/jessibuca/decoder.wasm',

        // 是否包含音频流（false 表示纯视频流）
        hasAudio: false,

        // 视频旋转角度（0/90/180/270）
        rotate: 0,

        // 控制条自动隐藏（鼠标移开后自动隐藏控制条）
        controlAutoHide: true
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
