<template>
    <div class="detail-dialog" @click="close">
        <div class="box" v-loading="loading" element-loading-background="rgba(6, 26, 64, 0.7)" @click.stop>
            <div class="detail-title">摄像头告警详情- 【{{ info.alarmTypeName }}】</div>
            <div class="detail-image">
                <el-image :src="info.alarmImg" :preview-src-list="[info.alarmImg]" fit="contain"
                    style="width: 384px; height: 211.2px;" alt="告警图片">
                    <template #error>
                        <div class="image-slot">
                            <span class="no-img">暂无图片</span>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="detail-device">
                {{ info.deviceName }}
            </div>
            <div class="info-bottom">
                <div class="info-row">
                    <div class="info-item">告警时间：<span>{{ info.alarmTime }}</span></div>
                    <div class="info-item">状态：<span :class="getStatusClass(localStatus)">{{ getStatusText(localStatus)
                            }}</span>
                    </div>
                </div>
                <div class="info-item">告警描述：</div>
                <div class="info-desc">
                    {{ info.alarmDescription || '' }}
                </div>
            </div>
            <div class="info-action">
                <template v-if="localStatus == 0">
                    <div class="desc">
                        <span>处理说明：</span>
                        <el-input v-model="desc" type="textarea" placeholder="请输入处理说明" :rows="2" resize="none" />
                    </div>
                    <div class="button" @click="!loading && alarmHandle(1)">
                        处理
                    </div>
                    <div class="button" @click="!loading && alarmHandle(2)">
                        误报
                    </div>
                </template>
                <div v-else class="desc-show">
                    <span class="label">处理说明：</span>
                    <span class="content">{{ localDesc || '无' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useDatavStore } from '@/store/modules/datav'
import { handleAlarm } from '@/api/datav/monitor.js'
import alertAudio from '@/assets/datav/alert.mp3'

const datavStore = useDatavStore()
const { detailInfo: info, detailVisible } = storeToRefs(datavStore)

// 创建音频对象（全局单例或组件级）
const audio = new Audio(alertAudio)

const desc = ref('')
const loading = ref(false)
const localStatus = ref(info.value?.status ?? 0)
const localDesc = ref(info.value?.handleDescription || '')

// 播放音频函数
const playAlarmSound = () => {
    try {
        audio.currentTime = 0
        audio.play().catch(e => {
            console.warn('音频播放受限（需用户先交互）:', e)
        })
    } catch (e) {
        console.error('音频播放出错:', e)
    }
}

watch(info, (newInfo) => {
    if (newInfo) {
        localStatus.value = newInfo.status ?? 0
        localDesc.value = newInfo.handleDescription || ''
        desc.value = '' // 重置输入框

        // 如果弹窗是开启状态且数据更新，播报告警
        if (detailVisible.value) {
            playAlarmSound()
        }
    }
}, { deep: true, immediate: true })

// 监听弹窗显示，首次跳出时播放
watch(detailVisible, (visible) => {
    if (visible) {
        playAlarmSound()
    }
})

// 获取状态文本
const getStatusText = (status) => {
    const statusMap = {
        0: '未处理',
        1: '已处理',
        2: '误报'
    }
    return statusMap[status] || '-'
}

// 获取状态样式类
const getStatusClass = (status) => {
    const classMap = {
        0: 'status-pending',
        1: 'status-handled',
        2: 'status-false-alarm'
    }
    return classMap[status] || ''
}

const close = () => {
    datavStore.closeDetail()
}

const alarmHandle = (status) => {
    if (loading.value) return
    loading.value = true
    datavStore.onActionStart()

    const params = {
        status: status,
        alarmId: info.value.id,
        alarmDescription: desc.value || ''
    }

    handleAlarm(params).then(res => {
        if (res.code === 200 || res.code === 0 || res.code === '0') {
            ElMessage.success("操作成功")
            localStatus.value = status
            localDesc.value = desc.value
            datavStore.triggerRefresh()
        } else {
            ElMessage.error(res.msg || "操作失败")
        }
    }).catch(err => {
        ElMessage.error("系统繁忙，请稍后再试")
    }).finally(() => {
        loading.value = false
        // 只有在自动轮巡模式下，处理完毕才自动延迟关闭
        // 如果是手动点开的详情，则不自动关闭，由用户决定何时关闭
        if (!datavStore.isManualMode) {
            setTimeout(() => {
                datavStore.closeDetail()
            }, 3000)
        }
    })
}
</script>

<style lang="scss" scoped>
.detail-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    padding: 19.2px; // 0.1rem
    background-color: rgba(0, 0, 0, 0.7); //var(--detail-dialog-bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
}

.box {
    background: url("@/assets/datav/v1/warn_detail_bg.png") no-repeat center, #061A40;
    width: 960px; // 5rem
    height: 631.7px; // 3.29rem
    background-size: 100% 100%;
    color: #fff; // var(--detail-dialog-box)
    padding: 57.6px 38.4px 38.4px 38.4px; // 0.3rem 0.2rem 0.2rem 0.2rem
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.detail-title {
    font-size: 19.2px; // 0.1rem
    padding: 19.2px; // 0.1rem
    width: 100%;
}

.detail-image {
    text-align: center;

    .no-img {
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
        line-height: 211.2px;
    }

    :deep(.el-image) {
        cursor: pointer;

        img {
            transition: transform 0.3s;

            &:hover {
                transform: scale(1.02);
            }
        }
    }
}

.detail-device {
    width: 100%;
    text-align: center;
    font-size: 17.3px; // 0.09rem
    padding: 9.6px; // 0.05rem
}

.info-bottom {
    background: #042656;
    width: 100%;
    padding: 0 9.6px; // 0 0.05rem

    .info-row {
        display: flex;
        border-bottom: 1px dashed rgba(0, 212, 255, 0.3); // var(--dashed-color)
    }

    .info-item {
        padding: 9.6px 9.6px 9.6px 25px; // 0.05rem ... 0.13rem
        font-size: 15.4px; // 0.08rem
        position: relative;
        margin-right: 19.2px; // 0.1rem

        &::before {
            content: '';
            background: url("@/assets/datav/v1/dt-before.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            width: 23px; // 0.12rem
            height: 19.2px; // 0.1rem (approx)
            left: 0;
            top: 10.6px; // 0.055rem
        }
    }

    .info-desc {
        padding: 0 9.6px 19.2px 9.6px; // 0 0.05rem 0.1rem
        font-size: 17.3px; // 0.09rem
    }
}

.info-action {
    display: flex;
    justify-content: flex-end; // right -> flex-end
    align-items: center;
    padding: 19.2px; // 0.1rem
    width: 100%;
    margin-top: auto; // push to bottom

    .desc {
        width: 576px; // 3rem
        font-size: 17.3px; // 0.09rem
        display: flex;
        align-items: center;

        span {
            width: 115.2px; // 0.6rem
            white-space: nowrap;
        }

        :deep(.el-textarea__inner) {
            background-color: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(0, 113, 188, 0.5) !important;
            color: #fff !important;
            padding: 5px 10px;

            &::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }
        }
    }

    .button {
        width: 96px; // 0.5rem
        height: 38.4px; // 0.2rem
        line-height: 38.4px;
        text-align: center;
        background: #0071bc;
        margin-left: 19.2px; // 0.1rem
        cursor: pointer;
        border-radius: 6px;
        font-size: 15px;

        &:hover {
            background: #0091ff;
        }
    }

    .desc-show {
        width: 100%;
        display: flex;
        font-size: 17.3px;
        color: #fff;

        .label {
            color: rgba(255, 255, 255, 0.7);
            white-space: nowrap;
        }

        .content {
            word-break: break-all;
        }
    }
}

.status-pending {
    color: #ff6b6b !important;
}

.status-handled {
    color: #52c41a !important;
}

.status-false-alarm {
    color: #faad14 !important;
}

.handled-desc {
    color: #fff;
}
</style>
