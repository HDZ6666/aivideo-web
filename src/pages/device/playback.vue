<!-- 录像回放页面 - 基于live.vue模板 -->
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "录像回放"
  }
}
</route>

<script lang="ts" setup>
import type { IRecordPlayInfo, IRecordSegment } from '@/api/record'
import type { DeviceChannelInfo } from '@/components/device-selector'
import { formatDate } from 'sard-uniapp'
import { computed, onMounted, ref } from 'vue'
import { getNationalRecordList, getRecordPlayUrl } from '@/api/record'
import { DeviceSelector } from '@/components/device-selector'
import { LoadingState } from '@/components/loading-state'
import { HlsPlayer } from '@/components/player'

import { DeviceType, useDeviceStore } from '@/store/device'

defineOptions({
  name: 'RecordPlayback',
})

// ==================== 响应式数据 ====================
const deviceStore = useDeviceStore()
const hlsPlayerRef = ref()
const hlsUrl = ref('')
const deviceChannelInfo = ref<DeviceChannelInfo | null>(null)
const playInfo = ref<IRecordPlayInfo | null>(null)
const recordSegments = ref<IRecordSegment[]>([])
const selectedDate = ref<Date | undefined>(new Date())
const currentPlayingSegment = ref<IRecordSegment | null>(null)
const loading = ref(false)

// 日历选择器相关
const calendarVisible = ref(false)

// ==================== 计算属性 ====================
const channelName = computed(() => {
  return deviceChannelInfo.value?.channelName || '录像回放'
})

const formattedDate = computed(() => {
  if (!selectedDate.value)
    return '请选择日期'
  return formatDate(selectedDate.value, 'YYYY-MM-DD')
})

const hasRecordSegments = computed(() => {
  return recordSegments.value.length > 0
})

// ==================== 方法定义 ====================

/**
 * 返回上一页
 */
function handleBack() {
  uni.navigateBack()
}

/**
 * 设备类型变更处理
 */
function handleDeviceTypeChange(deviceType: DeviceType) {
  deviceChannelInfo.value = {
    deviceType,
    deviceName: '',
    channelName: '',
  }
  // 清空相关数据
  hlsUrl.value = ''
  playInfo.value = null
  recordSegments.value = []
  selectedDate.value = undefined
  currentPlayingSegment.value = null
}

/**
 * 设备变更处理
 */
function handleDeviceChange(newDeviceChannelInfo: DeviceChannelInfo) {
  deviceChannelInfo.value = newDeviceChannelInfo
  // 清空录像相关数据
  hlsUrl.value = ''
  playInfo.value = null
  recordSegments.value = []
  selectedDate.value = undefined
  currentPlayingSegment.value = null

  // 设置默认日期为今天
  const today = new Date()
  selectedDate.value = today

  // 自动加载今天的录像列表
  loadRecordSegments()
}

/**
 * 显示日历选择器
 */
function showCalendar() {
  if (!deviceChannelInfo.value) {
    console.error('请先选择设备通道')
    return
  }
  calendarVisible.value = true
}

/**
 * 日历选择变化
 */
function handleCalendarChange(date: Date) {
  loadRecordSegments()
}

/**
 * 加载录像片段列表
 */
async function loadRecordSegments() {
  if (!deviceChannelInfo.value || !selectedDate.value) {
    return
  }

  loading.value = true

  const deviceId = deviceChannelInfo.value.deviceId || ''
  const channelId = deviceChannelInfo.value.channelId || ''
  const dateStr = formatDate(selectedDate.value, 'YYYY-MM-DD')
  const startTime = `${dateStr} 00:00:00`
  const endTime = `${dateStr} 23:59:59`

  try {
    const response = await getNationalRecordList(deviceId, channelId, startTime, endTime)
    recordSegments.value = response.recordList
  }
  catch (error) {
    console.error('获取录像列表失败:', error)
  }
  finally {
    loading.value = false
  }
}

/**
 * 播放录像片段
 */
async function playRecordSegment(segment: IRecordSegment) {
  if (!deviceChannelInfo.value)
    return

  const deviceId = deviceChannelInfo.value.deviceId || ''
  const channelId = deviceChannelInfo.value.channelId || ''
  const startTime = segment.startTime
  const endTime = segment.endTime
  currentPlayingSegment.value = segment

  uni.showLoading({
    title: '视频加载中...',
    mask: true,
  })

  try {
    const response = await getRecordPlayUrl(deviceId, channelId, startTime, endTime)
    hlsUrl.value = response.hls
    playInfo.value = response
  }
  catch (error) {
    console.error('获取录像播放地址失败:', error)
  }
  finally {
    uni.hideLoading()
  }
}

/**
 * 计算录像时长（秒）
 */
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.floor((end - start) / 1000)
}

/**
 * 格式化时长
 */
function formatDuration(startTime: string, endTime: string): string {
  const seconds = calculateDuration(startTime, endTime)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化文件大小
 */
function formatFileSize(fileSizeStr: string): string {
  const bytes = Number.parseInt(fileSizeStr)
  if (bytes === 0)
    return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

/**
 * 获取录像类型标签
 */
function getRecordTypeLabel(type: 'time' | 'alarm'): string {
  return type === 'time' ? '定时录像' : '告警录像'
}

/**
 * 获取录像类型样式类
 */
function getRecordTypeClass(type: 'time' | 'alarm'): string {
  return type === 'time' ? 'time' : 'alarm'
}

/**
 * 初始化设备通道信息和录像列表
 */
async function initPlayUrl() {
  try {
    const deviceType = deviceStore.selectedDeviceType

    if (deviceType === 'national') {
      const selectedChannel = deviceStore.selectedChannel
      if (selectedChannel) {
        deviceChannelInfo.value = {
          deviceType: DeviceType.NATIONAL,
          deviceName: selectedChannel.name,
          channelName: selectedChannel.name,
          deviceId: selectedChannel.deviceId,
          channelId: selectedChannel.channelId,
        }

        // 设置默认日期为今天
        const today = new Date()
        selectedDate.value = today

        // 加载今天的录像列表
        await loadRecordSegments()
      }
      else {
        throw new Error('未找到国标设备通道信息')
      }
    }
    else {
      // 拉流设备暂不支持录像功能，显示设备信息但不加载录像
      const selectedProxyDevice = deviceStore.selectedProxyDevice
      if (selectedProxyDevice) {
        deviceChannelInfo.value = {
          deviceType: DeviceType.PROXY,
          deviceName: selectedProxyDevice.name,
          channelName: selectedProxyDevice.name,
          app: selectedProxyDevice.app,
          stream: selectedProxyDevice.stream,
          mediaServerId: selectedProxyDevice.mediaServerId,
        }

        // 设置默认日期为今天
        const today = new Date()
        selectedDate.value = today

        // 拉流设备不加载录像列表，保持空状态
      }
      else {
        throw new Error('未找到拉流设备信息或信息不完整')
      }
    }
  }
  catch (error) {
    console.error('初始化失败:', error)
  }
}

/**
 * 视频播放就绪
 */
function onHlsReady() {
  console.log('录像播放就绪')
}

/**
 * 视频播放错误
 */
function onHlsError() {
  console.log('录像播放错误')
}

onMounted(() => {
  initPlayUrl()
})
</script>

<template>
  <view class="record-playback-page bg-gray-50">
    <!-- 导航栏 -->
    <sar-navbar :title="channelName" class="navbar-custom">
      <template #left>
        <view class="back-button">
          <view class="i-carbon-arrow-left h-40rpx w-40rpx text-gray-600" @click="handleBack" />
        </view>
      </template>
    </sar-navbar>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 视频播放区域 -->
      <view class="video-section">
        <view class="video-container">
          <!-- HLS视频播放器 -->
          <HlsPlayer ref="hlsPlayerRef" :src="hlsUrl" @ready="onHlsReady" @error="onHlsError" />

          <!-- 播放信息覆盖层 -->
          <view v-if="currentPlayingSegment" class="play-info-overlay">
            <text class="play-info-text">
              {{ currentPlayingSegment.startTime }} - {{ currentPlayingSegment.endTime }}
            </text>
          </view>
        </view>
      </view>

      <!-- 设备通道选择区域 -->
      <view class="device-selector-section">
        <view class="content-wrapper">
          <DeviceSelector @device-type-change="handleDeviceTypeChange" @device-change="handleDeviceChange" />
        </view>
      </view>

      <!-- 日期选择和录像列表区域 -->
      <view class="record-section">
        <view class="content-wrapper">
          <!-- 日期选择器 -->
          <view class="date-selector-container mb-24rpx">
            <view class="date-selector" @click="showCalendar">
              <view class="i-carbon-calendar h-32rpx w-32rpx text-blue-500" />
              <text class="date-text">
                {{ formattedDate }}
              </text>
              <view class="i-carbon-chevron-down h-24rpx w-24rpx text-gray-400" />
            </view>
          </view>

          <!-- 录像片段列表 -->
          <view class="record-list-container">
            <!-- 加载状态 -->
            <LoadingState
              v-if="loading"
              state="loading"
              loading-text="正在加载录像数据..."
              compact
            />

            <!-- 空状态 -->
            <LoadingState
              v-else-if="!hasRecordSegments"
              state="empty"
              empty-text="暂无录像数据"
              empty-description="该日期没有录像记录"
              :show-retry="false"
              compact
            />

            <view v-else class="record-list">
              <view
                v-for="(segment, index) in recordSegments" :key="`${segment.startTime}_${segment.endTime}_${index}`"
                class="record-item"
                :class="{ active: currentPlayingSegment?.startTime === segment.startTime && currentPlayingSegment?.endTime === segment.endTime }"
                @click="playRecordSegment(segment)"
              >
                <view class="record-item-header">
                  <view class="record-time">
                    <text class="start-time">
                      {{ segment.startTime.split(' ')[1] }}
                    </text>
                    <text class="separator">
                      -
                    </text>
                    <text class="end-time">
                      {{ segment.endTime.split(' ')[1] }}
                    </text>
                  </view>
                  <view class="record-badges">
                    <view class="record-type-badge" :class="getRecordTypeClass(segment.type)">
                      {{ getRecordTypeLabel(segment.type) }}
                    </view>
                  </view>
                </view>

                <view class="record-item-info">
                  <text class="duration">
                    时长: {{ formatDuration(segment.startTime, segment.endTime) }}
                  </text>
                  <text class="file-size">
                    大小: {{ formatFileSize(segment.fileSize) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 日历选择器弹窗 -->
    <sar-calendar-popout
      v-model="selectedDate" v-model:visible="calendarVisible" title="选择日期"
      @change="handleCalendarChange"
    />
  </view>
</template>

<style lang="scss" scoped>
.record-playback-page {
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.navbar-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .back-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 88rpx;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.6;
      transform: scale(0.95);
    }
  }
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.video-section {
  height: 400rpx;
  background: #000;
  position: relative;

  .video-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .play-info-overlay {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    background: rgba(0, 0, 0, 0.7);
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    z-index: 10;

    .play-info-text {
      color: white;
      font-size: 24rpx;
    }
  }
}

.device-selector-section {
  flex-shrink: 0;
  background: #f9fafb;
}

.record-section {
  flex: 1;
  overflow-y: auto;
  background: #f9fafb;

  .content-wrapper {
    padding: 32rpx;
  }
}

.date-selector-container {
  .date-selector {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    background: white;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: scale(0.98);
    }

    .date-text {
      flex: 1;
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #374151;
      font-weight: 500;
    }
  }
}

.record-list-container {
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;

    .loading-text {
      margin-top: 16rpx;
      font-size: 28rpx;
      color: #6b7280;
    }
  }

  .empty-container {
    padding: 80rpx 0;
  }

  .record-list {
    .record-item {
      background: white;
      border-radius: 16rpx;
      padding: 24rpx;
      margin-bottom: 16rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2rpx solid transparent;

      &:hover {
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
        transform: translateY(-2rpx);
      }

      &:active {
        transform: scale(0.98);
      }

      &.active {
        border-color: #3b82f6;
        background: #eff6ff;
        box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.2);
      }

      .record-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12rpx;

        .record-time {
          display: flex;
          align-items: center;
          font-size: 28rpx;
          font-weight: 600;
          color: #1f2937;

          .separator {
            margin: 0 8rpx;
            color: #6b7280;
          }

          .end-time {
            color: #1f2937;
          }
        }

        .record-badges {
          display: flex;
          gap: 8rpx;

          .record-type-badge {
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
            font-size: 20rpx;
            font-weight: 500;

            &.time {
              background: #dbeafe;
              color: #1d4ed8;
            }

            &.alarm {
              background: #fef3c7;
              color: #d97706;
            }
          }

          .record-status-badge {
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
            font-size: 20rpx;
            font-weight: 500;

            &.error {
              background: #fee2e2;
              color: #dc2626;
            }
          }
        }
      }

      .record-item-info {
        display: flex;
        gap: 24rpx;
        font-size: 24rpx;
        color: #6b7280;

        .duration,
        .file-size {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
