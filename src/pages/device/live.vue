<!-- 简化版实时视频播放页面 - 上下布局 -->
<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "实时视频"
  }
}
</route>

<script lang="ts" setup>
import type { INationalPlayInfo, IProxyPlayInfo } from '@/api/device'
import type { DeviceChannelInfo } from '@/components/device-selector'
import { computed, onMounted, ref } from 'vue'
import { getNationalPlayUrl, getProxyPlayUrl } from '@/api/device'
import { DeviceSelector } from '@/components/device-selector'
import { HlsPlayer } from '@/components/player'
import { PtzController } from '@/components/ptz-control'
import { mockGetNationalPlayUrl, mockGetProxyPlayUrl } from '@/mock/device'
import { DeviceType, useDeviceStore } from '@/store/device'

defineOptions({
  name: 'Live',
})
const deviceStore = useDeviceStore()
const hlsPlayerRef = ref()
const hlsUrl = ref('')
const deviceChannelInfo = ref<DeviceChannelInfo | null>(null)
const playInfo = ref<INationalPlayInfo | IProxyPlayInfo | null>(null)

const channelName = computed(() => {
  return '实时视频'
})

async function getNationalDevicePlayUrl(deviceId: string, channelId: string) {
  if (!deviceId || !channelId) {
    throw new Error('国标设备参数不完整')
  }

  try {
    // 先请求正确的接口
    const response = await getNationalPlayUrl(deviceId, channelId, false)
    hlsUrl.value = response.hls
    playInfo.value = response
  }
  catch (error) {
    // 在catch中请求mock数据
    console.warn('正式接口请求失败，使用mock数据:', error)
    const response = await mockGetNationalPlayUrl(deviceId, channelId, false)
    hlsUrl.value = response.hls
    playInfo.value = response
  }
}

async function getProxyDevicePlayUrl(app: string, stream: string, mediaServerId?: string) {
  if (!app || !stream || !mediaServerId) {
    throw new Error('拉流设备参数不完整')
  }

  try {
    // 先请求正确的接口
    const response = await getProxyPlayUrl(app, stream, mediaServerId)
    hlsUrl.value = response.hls
    playInfo.value = response
  }
  catch (error) {
    // 在catch中请求mock数据
    console.warn('正式接口请求失败，使用mock数据:', error)
    const response = await mockGetProxyPlayUrl(app, stream, mediaServerId)
    hlsUrl.value = response.hls
    playInfo.value = response
  }
}

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
        await getNationalDevicePlayUrl(selectedChannel.deviceId, selectedChannel.channelId)
      }
      else {
        throw new Error('未找到国标设备通道信息')
      }
    }
    else {
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
        await getProxyDevicePlayUrl(
          selectedProxyDevice.app,
          selectedProxyDevice.stream,
          selectedProxyDevice.mediaServerId,
        )
      }
      else {
        throw new Error('未找到拉流设备信息或信息不完整')
      }
    }
  }
  catch (error) {
    uni.showToast({
      title: '获取播放地址失败',
      icon: 'error',
    })
  }
}

function handleBack() {
  uni.navigateBack()
}

function handleDeviceTypeChange(deviceType: DeviceType) {
  deviceChannelInfo.value = {
    deviceType,
    deviceName: '',
    channelName: '',
  }
  hlsUrl.value = ''
  playInfo.value = null
}

function handleDeviceChange(newDeviceChannelInfo: DeviceChannelInfo) {
  deviceChannelInfo.value = newDeviceChannelInfo

  if (newDeviceChannelInfo.deviceType === DeviceType.NATIONAL) {
    if (newDeviceChannelInfo.deviceId && newDeviceChannelInfo.channelId) {
      getNationalDevicePlayUrl(newDeviceChannelInfo.deviceId, newDeviceChannelInfo.channelId)
    }
  }
  else if (newDeviceChannelInfo.deviceType === DeviceType.PROXY) {
    if (newDeviceChannelInfo.app && newDeviceChannelInfo.stream && newDeviceChannelInfo.mediaServerId) {
      getProxyDevicePlayUrl(
        newDeviceChannelInfo.app,
        newDeviceChannelInfo.stream,
        newDeviceChannelInfo.mediaServerId,
      )
    }
  }
}

function onHlsReady() {
  // 视频播放就绪
  console.log('视频播放就绪')
}

function onHlsError() {
  console.log('视频播放错误')
}

// 云台控制成功处理
function onControlSuccess(result: { type: 'ptz' | 'device', action: string, data?: any }) {
  // 可以根据需要添加成功提示或日志
  console.log('控制操作成功:', result)
}

// 云台控制错误处理
function onControlError(error: { type: 'ptz' | 'device', action: string, message: string }) {
  console.log('控制操作失败:', error)
}

onMounted(() => {
  initPlayUrl()
})
</script>

<template>
  <view class="live-page bg-gray-50">
    <!-- 导航栏 - 参考 national-detail 样式 -->
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
        </view>
      </view>

      <!-- 设备通道选择区域 -->
      <view class="device-selector-section">
        <view class="content-wrapper">
          <DeviceSelector @device-type-change="handleDeviceTypeChange" @device-change="handleDeviceChange" />
        </view>
      </view>

      <!-- 云台控制区域 -->
      <view class="ptz-section">
        <view class="content-wrapper">
          <PtzController
            :device-channel-info="deviceChannelInfo"
            @control-success="onControlSuccess"
            @control-error="onControlError"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.live-page {
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
}

.device-selector-section {
  flex-shrink: 0;
  background: #f9fafb;
}

.ptz-section {
  flex: 1;
  overflow-y: auto;

  .content-wrapper {
    padding: 32rpx;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
