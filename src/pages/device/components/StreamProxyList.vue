<script setup lang="ts">
import type { IProxyDevice } from '@/api/device'
import { LoadingState } from '@/components/loading-state'
import { useDeviceStore } from '@/store/device'

interface Props {
  deviceList: IProxyDevice[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const deviceStore = useDeviceStore()

function getDeviceStatusText(device: IProxyDevice) {
  return device.status ? '在线' : '离线'
}

function getDeviceTypeBadgeClasses(device: IProxyDevice) {
  return device.status ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
}

function handleDeviceSelect(device: IProxyDevice) {
  deviceStore.setSelectedProxyDevice(device)
  uni.navigateTo({
    url: '/pages/device/proxy-detail',
  })
}
</script>

<template>
  <view class="stream-proxy-list">
    <view class="device-list-section">
      <!-- 加载状态 -->
      <LoadingState
        v-if="props.loading && props.deviceList.length === 0"
        state="loading"
        loading-text="正在加载拉流设备..."
        compact
      />

      <template v-else>
        <view
          v-for="device in props.deviceList" :key="device.id" class="device-list-item mb-24rpx"
          :class="{ 'device-list-item--offline': !(device.online ?? device.status) }"
          @click="handleDeviceSelect(device)"
        >
          <view
            class="device-card rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
          >
            <view
              class="card-gradient absolute h-128rpx w-128rpx rounded-full opacity-10 -right-32rpx -top-32rpx"
              :class=" device.status ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'"
            />

            <view class="device-info relative z-10">
              <view class="device-header mb-24rpx flex items-start justify-between">
                <view class="device-basic-info flex-1">
                  <view class="device-name mb-8rpx text-32rpx text-gray-800 font-semibold leading-tight">
                    {{ device.name }}
                  </view>

                  <view class="device-id mb-16rpx text-24rpx text-gray-500 font-mono">
                    流ID: {{ device.stream }}
                  </view>
                </view>

                <view class="status-indicator flex items-center">
                  <view
                    class="status-dot mr-8rpx h-16rpx w-16rpx rounded-full"
                    :class="device.status ? 'bg-green-500' : 'bg-red-500'"
                  />
                  <text
                    class="status-text text-24rpx font-medium"
                    :class="device.status ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ getDeviceStatusText(device) }}
                  </text>
                </view>
              </view>

              <view class="device-details">
                <view class="device-detail-row flex items-center justify-between py-8rpx">
                  <text class="detail-label text-24rpx text-gray-500">
                    流应用名
                  </text>
                  <text class="detail-value text-24rpx text-gray-700">
                    {{ device.app || '未知' }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-8rpx">
                  <text class="detail-label text-24rpx text-gray-500">
                    流地址
                  </text>
                  <text class="detail-value text-24rpx text-gray-700">
                    {{ device.url || '未知' }}
                  </text>
                </view>
                <view class="device-detail-row flex items-center justify-between py-8rpx">
                  <text class="detail-label text-24rpx text-gray-500">
                    类型
                  </text>
                  <text class="detail-value text-24rpx text-gray-700">
                    {{ device.type === "default" ? "直接代理" : "FFMPEG代理" }}
                  </text>
                </view>
              </view>

              <view class="device-actions mt-24rpx flex items-center justify-between border-t border-gray-100 pt-24rpx">
                <view
                  class="device-type-badge rounded-12rpx px-16rpx py-8rpx text-20rpx font-medium"
                  :class="getDeviceTypeBadgeClasses(device)"
                >
                  拉流设备
                </view>

                <view
                  class="detail-button flex items-center rounded-16rpx bg-blue-50 px-24rpx py-12rpx text-blue-600 transition-all duration-200"
                  @click.stop="handleDeviceSelect(device)"
                >
                  <text class="mr-8rpx text-24rpx font-medium">
                    查看详情
                  </text>
                  <view class="i-carbon-arrow-right h-20rpx w-20rpx" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.device-list-item {
  position: relative;

  &--offline {
    opacity: 0.8;
  }
}

.device-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow:
      inset 4rpx 4rpx 8rpx rgba(163, 177, 198, 0.3),
      inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
  }
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

  .detail-value {
    max-width: 400rpx;
    text-align: right;
    word-wrap: break-word;
    word-break: break-all;
  }
}

.device-actions {
  .device-type-badge {
    font-size: 20rpx;
    font-weight: 500;
    letter-spacing: 0.5rpx;
  }

  .detail-button {
    &:active {
      background-color: rgba(59, 130, 246, 0.15);
      transform: scale(0.95);
    }
  }
}
</style>
