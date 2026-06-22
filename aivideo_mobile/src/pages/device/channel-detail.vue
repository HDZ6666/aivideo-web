<!-- 通道详情页面路由配置 -->
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "通道详情"
  }
}
</route>

<script lang="ts" setup>
import type { INationalChannel } from '@/api/device'
import { computed, onMounted } from 'vue'
import { SmartImage } from '@/components/smart-image'
import { useDeviceStore } from '@/store/device'

defineOptions({
  name: 'ChannelDetail',
})

const deviceStore = useDeviceStore()

// 当前通道设备
const channelDevice = computed(() => deviceStore.selectedChannel)

// 设备名称
const deviceName = computed(() => {
  return '国标通道详情'
})

/**
 * 返回上一页
 */
function handleBack() {
  uni.navigateBack()
}

/**
 * 实时视频处理
 */
function handleLiveVideo() {
  if (!channelDevice.value?.status) {
    console.error('通道离线，无法播放')
    return
  }

  console.log('播放实时视频:', channelDevice.value)

  // 跳转到实时视频播放页面
  uni.navigateTo({
    url: '/pages/device/live',
  })
}

/**
 * 设备录像处理
 */
function handleDeviceRecording() {
  if (!channelDevice.value?.status) {
    console.error('通道离线，无法查看录像')
    return
  }

  console.log('查看设备录像:', channelDevice.value)

  // 跳转到录像回放页面
  uni.navigateTo({
    url: '/pages/device/playback',
  })
}

/**
 * 云端录像处理
 */
function handleCloudRecording() {
  if (!channelDevice.value?.status) {
    uni.showToast({
      title: '通道离线，无法查看录像',
      icon: 'error',
    })
    return
  }

  console.log('查看云端录像:', channelDevice.value)

  // 跳转到录像回放页面
  uni.navigateTo({
    url: '/pages/record/playback',
  })
}

// ==================== 快照相关功能 ====================

/**
 * 生成快照URL
 * @param channel 通道信息
 * @returns 快照图片URL
 */
function getSnapshotUrl(channel: INationalChannel): string {
  return `${import.meta.env.VITE_APP_PROXY_PREFIX}/api/device/query/snap/${channel.deviceId}/${channel.channelId}`
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 检查是否有通道数据
  if (!channelDevice.value) {
    uni.showToast({
      title: '请先选择通道',
      icon: 'error',
    })
  }
})
</script>

<template>
  <view class="channel-detail-page bg-gray-50">
    <!-- 导航栏 -->
    <sar-navbar :title="deviceName" class="navbar-custom">
      <template #left>
        <view class="back-button">
          <view class="i-carbon-arrow-left h-40rpx w-40rpx text-gray-600" @click="handleBack" />
        </view>
      </template>
    </sar-navbar>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <view class="content-wrapper">
        <view v-if="channelDevice">
          <!-- 通道信息卡片 -->
          <view class="channel-info-card mb-32rpx rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg">
            <!-- 装饰性渐变背景 -->
            <view
              class="card-gradient absolute h-128rpx w-128rpx rounded-full opacity-10 -right-32rpx -top-32rpx"
              :class="channelDevice.status ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'"
            />

            <!-- 通道信息主体 -->
            <view class="channel-info relative z-10">
              <!-- 通道头部信息 -->
              <view class="channel-header mb-24rpx flex items-start justify-between">
                <view class="channel-basic-info flex-1">
                  <!-- 通道名称 -->
                  <view class="channel-name mb-8rpx text-36rpx text-gray-800 font-semibold leading-tight">
                    {{ channelDevice.name }}
                  </view>

                  <!-- 通道编号 -->
                  <view class="channel-id mb-16rpx text-28rpx text-gray-500 font-mono">
                    通道编号: {{ channelDevice.channelId }}
                  </view>
                </view>

                <!-- 在线状态指示器 -->
                <view class="status-indicator flex items-center">
                  <view
                    class="status-dot mr-12rpx h-20rpx w-20rpx rounded-full"
                    :class="channelDevice.status ? 'bg-green-500' : 'bg-red-500'"
                  />
                  <text
                    class="status-text text-28rpx font-medium"
                    :class="channelDevice.status ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ channelDevice.status ? '在线' : '离线' }}
                  </text>
                </view>
              </view>

              <!-- 通道详细信息 -->
              <view class="channel-details">
                <view class="channel-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    设备编号
                  </text>
                  <text class="detail-value text-28rpx text-gray-700 font-mono">
                    {{ channelDevice.deviceId || '未知' }}
                  </text>
                </view>
                <view class="channel-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    厂家
                  </text>
                  <text
                    class="detail-value text-28rpx font-medium"
                    :class="channelDevice.ptz ? 'text-green-600' : 'text-gray-600'"
                  >
                    {{ channelDevice.manufacture || '未知' }}
                  </text>
                </view>
                <view
                  v-if="channelDevice.longitude"
                  class="channel-detail-row flex items-center justify-between py-12rpx"
                >
                  <text class="detail-label text-28rpx text-gray-500">
                    经纬度
                  </text>
                  <text class="detail-value text-28rpx text-gray-700">
                    {{ channelDevice.longitude }}, {{ channelDevice.latitude }}
                  </text>
                </view>
                <view class="channel-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    云台类型
                  </text>
                  <text
                    class="detail-value text-28rpx font-medium"
                    :class="channelDevice.ptz ? 'text-green-600' : 'text-gray-600'"
                  >
                    {{ channelDevice.PTZTypeText || '未知' }}
                  </text>
                </view>
              </view>

              <!-- 快照行 -->
              <view v-if="channelDevice.status" class="snapshot-row mt-16rpx">
                <view class="snapshot-container w-full">
                  <view class="snapshot-wrapper relative h-350rpx w-full overflow-hidden rounded-12rpx bg-gray-100">
                    <SmartImage
                      :src="getSnapshotUrl(channelDevice)"
                      class="smart-image-snapshot"
                      height="350rpx"
                      width="100%" mode="aspectFit"
                      border-radius="12rpx"
                      :icon-size="128"
                      :text-size="28"
                      :show-state-text="true"
                      :enable-preview="true"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 功能按钮区域 -->
          <view class="function-buttons">
            <view class="grid grid-cols-3 gap-24rpx">
              <!-- 实时视频按钮 -->
              <view
                class="function-btn rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
                :class="{ 'opacity-50': !channelDevice.status }" @click="handleLiveVideo"
              >
                <view class="flex flex-col items-center">
                  <view
                    class="function-icon mb-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-20rpx bg-blue-50"
                  >
                    <view class="i-carbon-video h-48rpx w-48rpx text-blue-500" />
                  </view>
                  <text class="function-text text-24rpx text-gray-800 font-medium">
                    实时视频
                  </text>
                </view>
              </view>

              <!-- 设备录像按钮 -->
              <view
                class="function-btn rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
                @click="handleDeviceRecording"
              >
                <view class="flex flex-col items-center">
                  <view
                    class="function-icon mb-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-20rpx bg-orange-50"
                  >
                    <view class="i-carbon-video-chat h-48rpx w-48rpx text-orange-500" />
                  </view>
                  <text class="function-text text-24rpx text-gray-800 font-medium">
                    设备录像
                  </text>
                </view>
              </view>

              <!-- 云端录像按钮 -->
              <!-- <view
                class="function-btn rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
                @click="handleCloudRecording"
              >
                <view class="flex flex-col items-center">
                  <view
                    class="function-icon mb-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-20rpx bg-purple-50"
                  >
                    <view class="i-carbon-cloud-upload h-48rpx w-48rpx text-purple-500" />
                  </view>
                  <text class="function-text text-24rpx text-gray-800 font-medium">
                    云端录像
                  </text>
                </view>
              </view> -->
            </view>
          </view>
        </view>

        <!-- 空状态 - 无通道信息 -->
        <view v-else class="flex flex-col items-center justify-center py-120rpx empty-container">
          <view
            class="empty-icon mb-32rpx h-120rpx w-120rpx flex items-center justify-center rounded-32rpx bg-gray-50 shadow-gray-300/50 shadow-inner"
          >
            <view class="i-carbon-video h-64rpx w-64rpx text-gray-400" />
          </view>
          <text class="empty-title mb-16rpx text-28rpx text-gray-600">
            暂无通道信息
          </text>
          <text class="empty-description text-24rpx text-gray-400">
            请先选择通道查看详情
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 新拟物设计风格样式 */
.channel-detail-page {
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
}

.content-wrapper {
  padding: 32rpx;
}

/* 通道信息卡片样式 */
.channel-info-card {
  position: relative;
  overflow: hidden;
}

.channel-info {
  position: relative;
  z-index: 10;
}

.channel-name {
  line-height: 1.3;
  word-break: break-all;
}

.channel-id {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.status-indicator {
  .status-dot {
    box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
  }
}

.channel-details {
  .channel-detail-row {
    border-bottom: 1rpx solid rgba(229, 231, 235, 0.5);

    &:last-child {
      border-bottom: none;
    }
  }
}

/* 通用详情值样式 */
.detail-value {
  text-align: right;

  &.font-mono {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  }
}

/* 功能按钮样式 */
.function-btn {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow:
      inset 4rpx 4rpx 8rpx rgba(163, 177, 198, 0.3),
      inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
  }
}

.function-icon {
  transition: all 0.3s ease;
}

/* 空状态样式 */
.empty-container {
  .empty-icon {
    transition: all 0.3s ease;
  }
}

/* 快照相关样式 */
.snapshot-row {
}

.snapshot-container {
  cursor: pointer;

  .snapshot-wrapper {
    border: 2rpx solid rgba(229, 231, 235, 0.6);
    transition: all 0.3s ease;

    &:hover .snapshot-overlay {
      opacity: 1;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .snapshot-overlay {
    backdrop-filter: blur(2rpx);
  }
}

// SmartImage 样式优化
.smart-image-snapshot {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}
</style>
