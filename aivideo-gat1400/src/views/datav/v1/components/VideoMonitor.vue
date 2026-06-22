<template>
    <div class="video-monitor-container">
        <div class="video-box">
            <div class="video-header">
                <div class="title-box">
                    <div class="text">监控视频</div>
                </div>
                <div class="more">
                    <div class="more-item">
                        自动轮播
                        <el-switch v-model="autoPlay" size="small" style="margin-left: 10px;" />
                    </div>
                    <div class="more-item">
                        画布展示
                        <el-select v-model="pageSize" size="small" class="page-select" @change="handlePageSizeChange">
                            <el-option label="四宫格" value="4" />
                            <el-option label="九宫格" value="9" />
                            <el-option label="十二宫格" value="12" />
                        </el-select>
                    </div>
                    <div class="more-item fullscreen-btn" @click="$emit('fullscreen')">
                        {{ isFullscreen ? '退出全屏' : '全屏' }}
                        <span class="fullscreen-icon" :class="{ 'is-exit': isFullscreen }"></span>
                    </div>
                </div>
            </div>
            <div class="video-content" v-loading="isLoading" element-loading-text="正在拉取视频资源..."
                element-loading-background="rgba(10, 22, 40, 0.7)">
                <div class="videos">
                    <div class="row">
                        <div :class="{
                            col: true,
                            col2: pager.pageSize == 4,
                            col3: pager.pageSize == 9,
                            col4: pager.pageSize == 12,
                            active: selectedCameraId === item.id
                        }" v-for="(item, index) in displayCameraList" :key="index" @click="handleVideoClick(item)">
                            <div class="player">
                                <div class="video-wrapper">
                                    <JessibucaPlayer v-if="item.streamUrl"
                                        :key="`player-${item.id}-${item.selectedStreamType}`"
                                        :video-url="item.streamUrl" :auto-play="true" :muted="true" :debug="false"
                                        :show-operate-btns="true" @error="handlePlayerError(item, $event)" />
                                    <div v-else class="video-placeholder">
                                        <span class="no-video-text">无视频资源</span>
                                    </div>
                                </div>
                            </div>
                            <div class="video-footer">
                                <div class="video-name" :title="item.name || item.deviceName || '未命名'">{{
                                    item.name || item.deviceName || '未命名' }}</div>
                                <div class="stream-selector">
                                    <el-dropdown trigger="click" @command="(cmd) => handleStreamTypeChange(cmd, item)"
                                        size="small">
                                        <span class="stream-type-label">
                                            {{streamTypeOptions.find(o => o.value === item.selectedStreamType)?.label
                                                || '码流'}}
                                            <el-icon style="vertical-align: middle;">
                                                <ArrowDown />
                                            </el-icon>
                                        </span>
                                        <template #dropdown>
                                            <el-dropdown-menu class="dark-dropdown-menu">
                                                <el-dropdown-item v-for="opt in streamTypeOptions" :key="opt.value"
                                                    :command="opt.value" :disabled="!item.streamInfo?.[opt.value]?.url"
                                                    :class="{ active: item.selectedStreamType === opt.value }">
                                                    {{ opt.label }}
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pager">
            <div class="rt">
                <div class="button" @click="handlePage(-1)">上一屏</div>
                <div class="pageNum">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
                <div class="button" @click="handlePage(1)">下一屏</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDatavStore } from '@/store/modules/datav'
import JessibucaPlayer from '@/components/player/JessibucaPlayer.vue'
import { listCamera } from '@/api/datav/monitor.js'

// Props
const props = defineProps({
    isFullscreen: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['fullscreen'])

// 播放源选项
const streamTypeOptions = [
    { label: 'WS-FLV', value: 'ws_flv' },
    { label: 'WSS-FLV', value: 'wss_flv' },
    { label: 'FLV', value: 'flv' },
    { label: 'HLS', value: 'hls' },
    { label: 'RTC', value: 'rtc' },
    { label: 'RTSP', value: 'rtsp' },
    { label: 'RTMP', value: 'rtmp' },
    { label: 'FMP4', value: 'fmp4' },
    { label: 'TS', value: 'ts' },
    { label: 'HTTPS-FLV', value: 'https_flv' },
    { label: 'HTTPS-HLS', value: 'https_hls' }
]

// 注入 Pinia Store
const datavStore = useDatavStore()
const { videoAutoPlay: autoPlay, videoPageSize: pageSize } = storeToRefs(datavStore)

// 内部状态管理
const isLoading = ref(false)
const cameraList = ref([])
const pager = ref({
    pageIndex: 1,
    pageSize: parseInt(pageSize.value),
    totalPage: 1
})

// 选中的摄像头 ID
const selectedCameraId = ref(null)

// 实际显示的摄像头列表（分页后）
const displayCameraList = computed(() => {
    const size = parseInt(pageSize.value)
    const start = (pager.value.pageIndex - 1) * size
    const end = start + size
    return cameraList.value.slice(start, end)
})

const getCameraList = (categoryId = null, options = {}) => {
    const params = {
        page: options.page || 1,
        pageSize: options.pageSize || 1000
    }

    isLoading.value = true

    // 根据业务逻辑添加筛选条件
    if (categoryId) {
        if (options.type === 'device') {
            params.deviceId = categoryId
            params.type = options.deviceType || 'DEVICE'
        } else {
            params.categoryId = categoryId
        }
    }

    listCamera(params).then(res => {
        const data = res.data?.list || []
        cameraList.value = data.map(item => ({
            id: item.id,
            name: item.name,
            deviceId: item.channel,
            channelId: item.channel,
            // 默认优先使用 ws_flv
            selectedStreamType: 'ws_flv',
            streamUrl: item.streamInfo?.ws_flv?.url || item.streamInfo?.flv?.url || item.streamInfo?.hls?.url || '',
            status: item.status,
            ...item
        }))

        const total = cameraList.value.length
        pager.value.pageIndex = 1
        pager.value.totalPage = Math.ceil(total / pager.value.pageSize) || 1
        isLoading.value = false
    }).catch(err => {
        isLoading.value = false
    })
}

const handlePageSizeChange = (val) => {
    datavStore.updateVideoPageSize(val)
    const newPageSize = parseInt(val)
    pager.value.pageSize = newPageSize
    pager.value.pageIndex = 1
    // 重新计算总页数
    const total = cameraList.value.length
    pager.value.totalPage = Math.ceil(total / newPageSize) || 1

    // 如果开启了自动轮播，手动操作后重新计时
    if (autoPlay.value) {
        startAutoPlay()
    }
}

const handlePage = (direction) => {
    if (direction > 0) {
        if (pager.value.pageIndex < pager.value.totalPage) {
            pager.value.pageIndex++
        }
    } else {
        if (pager.value.pageIndex > 1) {
            pager.value.pageIndex--
        }
    }

    // 如果开启了自动轮播，手动操作后重新计时
    if (autoPlay.value) {
        startAutoPlay()
    }
}

const handlePlayerError = (camera, error) => {
}

const handleVideoClick = (camera) => {
    if (camera.streamUrl) {
        selectedCameraId.value = camera.id
    }
}

const handleStreamTypeChange = (type, camera) => {
    const url = camera.streamInfo?.[type]?.url
    if (url) {
        camera.selectedStreamType = type
        camera.streamUrl = url
        // 强制刷新当前视频框是通过 :key="`player-${item.id}-${pager.pageIndex}`" 实现的
        // 但为了让同一个页面的同一个摄像头切换流也生效，我们需要在 key 中加入 streamUrl 或 streamType
    }
}

defineExpose({
    getCameraList,
    refreshList: getCameraList
})

// 自动轮播定时器
let autoPlayTimer = null

const startAutoPlay = () => {
    stopAutoPlay()
    autoPlayTimer = setInterval(() => {
        if (autoPlay.value && pager.value.totalPage > 1) {
            if (pager.value.pageIndex >= pager.value.totalPage) {
                pager.value.pageIndex = 1
            } else {
                pager.value.pageIndex++
            }
        }
    }, 10000)
}

const stopAutoPlay = () => {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
        autoPlayTimer = null
    }
}

// 监听自动轮播开关
watch(autoPlay, (newVal) => {
    datavStore.toggleVideoAutoPlay(newVal)
    if (newVal) {
        startAutoPlay()
    } else {
        stopAutoPlay()
    }
})

// 初始化
onMounted(() => {
    getCameraList()
    if (autoPlay.value) {
        startAutoPlay()
    }
})

onUnmounted(() => {
    stopAutoPlay()
})
</script>

<style lang="scss" scoped>
.video-monitor-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.video-box {
    width: 100%;
    height: calc(100% - 60px); // 为分页器留出空间
    position: relative;
    background: url("@/assets/datav/v1/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;

    .video-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px 0 40px;
        background: url("@/assets/datav/v1/camera_box_bg.png") no-repeat center;
        background-size: 100% 100%;
        border-bottom: 1px solid rgba(0, 102, 255, 0.3);
        box-sizing: border-box;

        &::before {
            content: '';
            position: absolute;
            width: 21px;
            height: 27px;
            top: 12px;
            left: 10px;
            background: url("@/assets/datav/v1/box_title_icon.png") no-repeat;
            background-size: 100% 100%;
        }

        .title-box {
            display: flex;
            align-items: center;
            font-size: 18px;
            color: #fff;
            font-weight: bold;
        }

        .more {
            display: flex;
            align-items: center;
            gap: 20px;

            .more-item {
                display: flex;
                align-items: center;
                color: #fff;
                font-size: 14px;
                cursor: pointer;

                .page-select {
                    margin-left: 10px;
                    width: 120px;
                }

                &.fullscreen-btn {
                    padding: 5px 15px;
                    background: rgba(0, 102, 255, 0.2);
                    border: 1px solid rgba(0, 102, 255, 0.5);
                    border-radius: 4px;
                    transition: all 0.3s;

                    &:hover {
                        background: rgba(0, 102, 255, 0.4);
                    }

                    .fullscreen-icon {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        margin-left: 5px;
                        border: 2px solid #fff;
                        border-radius: 2px;
                        position: relative;

                        &.is-exit {
                            border-style: dashed;

                            &::after {
                                content: '';
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 6px;
                                height: 6px;
                                background: #fff;
                            }
                        }
                    }
                }
            }
        }
    }

    .video-content {
        position: absolute;
        top: 50px;
        bottom: 10px; // 恢复为 10px
        left: 10px;
        right: 10px;
        overflow: hidden;

        .videos {
            width: 100%;
            height: 100%;

            .row {
                width: 100%;
                height: 100%;
                display: block;
                box-sizing: border-box;

                .col {
                    float: left;
                    overflow: hidden;
                    padding: 0 8px 0 8px;
                    box-sizing: border-box;
                    transition: all 0.3s ease;

                    // 选中状态 - 黄色边框高亮
                    &.active {
                        .player {
                            border: 2px solid #d5aa5b;
                            box-shadow: 0 0 2px rgba(213, 170, 91, 0.6);
                        }
                    }

                    .player {
                        height: calc(100% - 38px);
                        padding: 12px 6px;
                        background: url("@/assets/datav/v1/video_bg.png") no-repeat;
                        background-size: 100% 100%;
                        box-sizing: border-box;


                        .video-wrapper {
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(180deg, #0a1628 0%, #0d2137 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 1px solid #1fc6ff;

                            .no-video-text {
                                color: rgba(255, 255, 255, 0.5);
                                font-size: 14px;
                                letter-spacing: 1px;
                            }
                        }
                    }

                    .video-footer {
                        width: 100%;
                        height: 38px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 12px;
                        box-sizing: border-box;

                        .video-name {
                            flex: 1;
                            text-align: left;
                            color: #fff;
                            font-size: 15px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin-right: 10px;
                        }

                        .stream-selector {
                            .stream-type-label {
                                color: #1fc6ff;
                                font-size: 12px;
                                cursor: pointer;
                                padding: 2px 6px;
                                border: 1px solid rgba(31, 198, 255, 0.3);
                                border-radius: 2px;
                                background: rgba(31, 198, 255, 0.1);
                                transition: all 0.3s;

                                &:hover {
                                    background: rgba(31, 198, 255, 0.2);
                                    border-color: rgba(31, 198, 255, 0.6);
                                }
                            }
                        }
                    }
                }

                .col2 {
                    width: 50%;
                    height: 50%;
                }

                .col3 {
                    width: 33.333%;
                    height: 33.333%;
                }

                .col4 {
                    width: 25%;
                    height: 33.333%;
                }
            }
        }
    }
}

.pager {
    width: 100%;
    height: 50px;
    display: flex;
    color: #a0aec0;
    font-size: 15px;
    padding: 5px 10px;
    box-sizing: border-box;

    .rt {
        flex: 1;
        justify-content: right;
        display: flex;
        align-items: center;
    }

    .button {
        width: 96px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background: rgba(0, 100, 200, 0.5);
        border: 1px solid rgba(0, 150, 255, 0.5);
        border-radius: 4px;
        margin-left: 8px;
        cursor: pointer;
        color: #fff;

        &:hover {
            background: rgba(0, 150, 255, 0.5);
        }
    }

    .pageNum {
        line-height: 38px;
        font-size: 15px;
        padding: 0 6px 0 12px;
    }
}

// 下拉菜单深色样式
:deep(.dark-dropdown-menu) {
    background-color: #0a1628 !important;
    border: 1px solid #1fc6ff !important;
    padding: 4px 0 !important;

    .el-dropdown-menu__item {
        color: #fff !important;
        font-size: 13px !important;
        line-height: 30px !important;

        &:hover {
            background-color: rgba(31, 198, 255, 0.2) !important;
            color: #1fc6ff !important;
        }

        &.active {
            color: #1fc6ff !important;
            background-color: rgba(31, 198, 255, 0.1) !important;
        }

        &.is-disabled {
            color: rgba(255, 255, 255, 0.3) !important;
            background-color: transparent !important;
        }
    }

    .popper__arrow::after {
        border-bottom-color: #0a1628 !important;
    }
}
</style>
