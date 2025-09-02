<route lang="jsonc" type="page">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "设备详情"
  }
}
</route>

<script lang="ts" setup>
import type { INationalChannel } from '@/api/device'
import { getDeviceChannels } from '@/api/device'

import { useDeviceStore } from '@/store/device'
import NationalChannelList from './components/NationalChannelList.vue'

defineOptions({
  name: 'DeviceDetail',
})

const deviceStore = useDeviceStore()
const channelLoading = ref(false)
const channelList = ref<INationalChannel[]>([])
const paging = ref()

const nationalDevice = computed(() => deviceStore.selectedNationalDevice)
const deviceName = computed(() => {
  return '国标设备详情'
})

function handleBack() {
  uni.navigateBack()
}

async function onRefresh() {
  if (!nationalDevice.value) {
    paging.value?.complete()
    return
  }

  try {
    const deviceId = nationalDevice.value.deviceId
    if (deviceId) {
      await loadChannelData()
    }
  }
  catch (error) {
    console.error('刷新失败:', error)
  }
  finally {
    paging.value?.complete()
  }
}

async function loadChannelData() {
  if (!nationalDevice.value)
    return

  try {
    channelLoading.value = true
    const deviceId = nationalDevice.value.deviceId
    if (deviceId) {
      const response = await getDeviceChannels(deviceId, 1, 50)
      channelList.value = response.list
    }
  }
  catch (error) {
    console.error('加载通道数据失败:', error)
  }
  finally {
    channelLoading.value = false
  }
}

onMounted(() => {
  if (!nationalDevice.value) {
    console.error('请先选择设备')
    return
  }

  loadChannelData()
})
</script>

<template>
  <view class="device-detail-page bg-gray-50">
    <sar-navbar :title="deviceName" class="navbar-custom">
      <template #left>
        <view class="back-button">
          <view class="i-carbon-arrow-left h-40rpx w-40rpx text-gray-600" @click="handleBack" />
        </view>
      </template>
    </sar-navbar>

    <view class="main-content">
      <z-paging ref="paging" :fixed="false" refresher-only @on-refresh="onRefresh">
        <view class="content-wrapper">
          <view
            v-if="nationalDevice"
            class="device-info-card mb-32rpx rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg"
          >
            <view
              class="card-gradient absolute h-128rpx w-128rpx rounded-full opacity-10 -right-32rpx -top-32rpx"
              :class="nationalDevice.onLine ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'"
            />

            <view class="device-info relative z-10">
              <view class="device-header mb-24rpx flex items-start justify-between">
                <view class="device-basic-info flex-1">
                  <view class="device-name mb-8rpx text-36rpx text-gray-800 font-semibold leading-tight">
                    {{ nationalDevice.name }}
                  </view>

                  <view class="device-id mb-16rpx text-28rpx text-gray-500 font-mono">
                    设备编号: {{ nationalDevice.deviceId }}
                  </view>
                </view>

                <view class="status-indicator flex items-center">
                  <view
                    class="status-dot mr-12rpx h-20rpx w-20rpx rounded-full"
                    :class="nationalDevice.onLine ? 'bg-green-500' : 'bg-red-500'"
                  />
                  <text
                    class="status-text text-28rpx font-medium"
                    :class="nationalDevice.onLine ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ nationalDevice.onLine ? '在线' : '离线' }}
                  </text>
                </view>
              </view>

              <view class="device-details">
                <view class="device-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    地址
                  </text>
                  <text class="detail-value truncate text-28rpx text-gray-700">
                    {{ nationalDevice.hostAddress || '未知' }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    厂家
                  </text>
                  <text class="detail-value text-28rpx text-gray-700">
                    {{ nationalDevice.manufacturer || '未知' }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    信令传输
                  </text>
                  <text class="detail-value text-28rpx text-gray-700">
                    {{ nationalDevice.transport || '未知' }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    流传输
                  </text>
                  <text class="detail-value text-28rpx text-gray-700">
                    {{ nationalDevice.streamMode || '-' }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    通道数
                  </text>
                  <text class="detail-value text-28rpx text-gray-700">
                    {{ nationalDevice.channelCount || 0 }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-12rpx">
                  <text class="detail-label text-28rpx text-gray-500">
                    最近心跳
                  </text>
                  <text class="detail-value text-28rpx text-gray-700">
                    {{ nationalDevice.keepaliveTime || '-' }}
                  </text>
                </view>
              </view>
            </view>
          </view>

          <view v-if="nationalDevice" class="channel-list-section">
            <view class="section-header mb-24rpx flex items-center justify-between">
              <text class="section-title text-32rpx text-gray-800 font-semibold">
                通道列表
              </text>
              <text class="channel-count text-24rpx text-gray-500">
                共 {{ channelList.length }} 个通道
              </text>
            </view>

            <NationalChannelList :channel-list="channelList" :loading="channelLoading" />
          </view>

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
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.device-detail-page {
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

.channel-list-section {
  .section-header {
    margin-bottom: 24rpx;
  }
}

.detail-value {
  text-align: right;

  &.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.empty-container {
  .empty-icon {
    transition: all 0.3s ease;
  }
}
</style>
