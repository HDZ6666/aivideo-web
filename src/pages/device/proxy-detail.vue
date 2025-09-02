<!-- 拉流设备详情页面路由配置 -->
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "拉流设备详情"
  }
}
</route>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useDeviceStore } from '@/store/device'

defineOptions({
  name: 'ProxyDeviceDetail',
})

const deviceStore = useDeviceStore()

// 当前拉流设备
const proxyDevice = computed(() => deviceStore.selectedProxyDevice)

// 设备名称
const deviceName = computed(() => {
  return '拉流设备详情'
})

// ==================== 方法定义 ====================

/**
 * 返回上一页
 */
function handleBack() {
  uni.navigateBack()
}

/**
 * 格式化时间
 */
function formatTime(timeStr?: string) {
  if (!timeStr)
    return '-'
  return new Date(timeStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * 播放流处理
 */
function handlePlayStream() {
  if (!proxyDevice.value?.status) {
    console.error('设备离线，无法播放')
    return
  }

  console.log('播放流:', proxyDevice.value)

  // 跳转到实时视频播放页面
  uni.navigateTo({
    url: '/pages/device/live',
  })
}

/**
 * 云端录像处理
 */
function handleCloudRecording() {
  if (!proxyDevice.value?.status) {
    console.error('设备离线，无法查看录像')
    return
  }

  console.log('查看云端录像:', proxyDevice.value)

  // 跳转到录像回放页面
  uni.navigateTo({
    url: '/pages/device/playback',
  })
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 检查是否有拉流设备数据
  if (!proxyDevice.value) {
    console.error('请先选择拉流设备')
  }
})
</script>

<template>
  <view class="proxy-device-detail-page bg-gray-50">
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
        <!-- 拉流设备信息卡片 -->
        <view
          v-if="proxyDevice"
          class="device-info-card mb-32rpx rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg"
        >
          <!-- 装饰性渐变背景 -->
          <view
            class="card-gradient absolute h-128rpx w-128rpx rounded-full opacity-10 -right-32rpx -top-32rpx"
            :class="proxyDevice.status ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-red-400 to-red-600'"
          />

          <!-- 设备信息主体 -->
          <view class="device-info relative z-10">
            <!-- 设备头部信息 -->
            <view class="device-header mb-24rpx flex items-start justify-between">
              <view class="device-basic-info flex-1">
                <!-- 设备名称 -->
                <view class="device-name mb-8rpx text-36rpx text-gray-800 font-semibold leading-tight">
                  {{ proxyDevice.name }}
                </view>

                <!-- 设备ID -->
                <view class="device-id mb-16rpx text-28rpx text-gray-500 font-mono">
                  流ID: {{ proxyDevice.stream }}
                </view>
              </view>

              <!-- 在线状态指示器 -->
              <view class="status-indicator flex items-center">
                <view
                  class="status-dot mr-12rpx h-20rpx w-20rpx rounded-full"
                  :class="proxyDevice.status ? 'bg-green-500' : 'bg-red-500'"
                />
                <text
                  class="status-text text-28rpx font-medium"
                  :class="proxyDevice.status ? 'text-green-600' : 'text-red-600'"
                >
                  {{ proxyDevice.status ? '在线' : '离线' }}
                </text>
              </view>
            </view>

            <!-- 设备详细信息 -->
            <view class="device-details">
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  流应用名称
                </text>
                <text class="detail-value text-28rpx text-gray-700">
                  {{ proxyDevice.app || '未知' }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  流地址
                </text>
                <text class="detail-value truncate text-28rpx text-gray-700">
                  {{ proxyDevice.url || '未知' }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  类型
                </text>
                <text class="detail-value truncate text-28rpx text-gray-700">
                  {{ proxyDevice.type === "default" ? "直接代理" : "FFMPEG代理" }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  国标编码
                </text>
                <text class="detail-value truncate text-28rpx text-gray-700">
                  {{ proxyDevice.gbId || '未知' }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  状态
                </text>
                <text class="detail-value truncate text-28rpx text-gray-700">
                  {{ proxyDevice.enable ? "已启用" : "未启用" }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  音频
                </text>
                <text class="detail-value truncate text-28rpx text-gray-700">
                  {{ proxyDevice.enableAudio ? "已启用" : "未启用" }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  录制
                </text>
                <text class="detail-value truncate text-28rpx text-gray-700">
                  {{ proxyDevice.enableMp4 ? "已启用" : "未启用" }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  创建时间
                </text>
                <text class="detail-value text-28rpx text-gray-700">
                  {{ formatTime(proxyDevice.createTime) }}
                </text>
              </view>
              <view class="device-detail-row flex items-center justify-between py-12rpx">
                <text class="detail-label text-28rpx text-gray-500">
                  更新时间
                </text>
                <text class="detail-value text-28rpx text-gray-700">
                  {{ formatTime(proxyDevice.updateTime) }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- 操作按钮区域 -->
        <view v-if="proxyDevice" class="action-buttons">
          <view class="grid grid-cols-2 gap-24rpx">
            <!-- 播放按钮 -->
            <view
              class="action-btn rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
              :class="{ 'opacity-50': !proxyDevice.status }" @click="handlePlayStream"
            >
              <view class="flex flex-col items-center">
                <view
                  class="action-icon mb-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-20rpx bg-green-50"
                >
                  <view class="i-carbon-play h-48rpx w-48rpx text-green-500" />
                </view>
                <text class="action-text text-28rpx text-gray-800 font-medium">
                  播放流
                </text>
              </view>
            </view>

            <!-- 云端录像按钮 -->
            <view
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
            </view>
          </view>
        </view>

        <!-- 空状态 - 无设备信息 -->
        <view v-else class="flex flex-col items-center justify-center py-120rpx empty-container">
          <view
            class="empty-icon mb-32rpx h-120rpx w-120rpx flex items-center justify-center rounded-32rpx bg-gray-50 shadow-gray-300/50 shadow-inner"
          >
            <view class="i-carbon-devices h-64rpx w-64rpx text-gray-400" />
          </view>
          <text class="empty-title mb-16rpx text-28rpx text-gray-600">
            暂无设备信息
          </text>
          <text class="empty-description text-24rpx text-gray-400">
            请先选择设备查看详情
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 新拟物设计风格样式 */
.proxy-device-detail-page {
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

.device-info-card {
  position: relative;
  overflow: hidden;
}

.device-info {
  position: relative;
  z-index: 10;
}

.device-name {
  line-height: 1.3;
  word-break: break-all;
}

.device-id {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.status-indicator {
  .status-dot {
    box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
  }
}

.device-details {
  .device-detail-row {
    border-bottom: 1rpx solid rgba(229, 231, 235, 0.5);

    &:last-child {
      border-bottom: none;
    }
  }
}

/* 通用详情值样式 */
.detail-value {
  text-align: right;

  &.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.action-buttons {
  margin-top: 32rpx;
}

.action-btn {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow:
      inset 4rpx 4rpx 8rpx rgba(163, 177, 198, 0.3),
      inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
  }
}

.action-icon {
  transition: all 0.3s ease;
}

.action-text {
  transition: all 0.3s ease;
}

/* 空状态样式 */
.empty-container {
  .empty-icon {
    transition: all 0.3s ease;
  }
}
</style>
