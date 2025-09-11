<script setup lang="ts">
import type { INationalChannel } from '@/api/device'
import { LoadingState } from '@/components/loading-state'
import { SmartImage } from '@/components/smart-image'
import { useDeviceStore } from '@/store/device'

interface Props {
  channelList: INationalChannel[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const deviceStore = useDeviceStore()

function getChannelStatusText(channel: INationalChannel) {
  return (channel.online ?? channel.status) ? '在线' : '离线'
}

function getChannelTypeText(channel: INationalChannel) {
  if (channel.PTZTypeText) {
    return channel.PTZTypeText
  }
  const hasPTZ = channel.ptz || (channel.PTZType && channel.PTZType > 0)
  return hasPTZ ? 'PTZ通道' : '普通通道'
}

function getChannelTypeBadgeClasses(channel: INationalChannel) {
  const isOnline = channel.online ?? channel.status
  if (!isOnline) {
    return 'bg-gray-100 text-gray-500'
  }
  const hasPTZ = channel.ptz || (channel.PTZType && channel.PTZType > 0)
  return hasPTZ ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
}

function handleChannelSelect(channel: INationalChannel) {
  deviceStore.setSelectedChannel(channel)
  uni.navigateTo({
    url: '/pages/device/channel-detail',
  })
}

/**
 * 生成快照URL
 * @param channel 通道信息
 * @returns 快照图片URL
 */
function getSnapshotUrl(channel: INationalChannel): string {
  return `${import.meta.env.VITE_APP_PROXY_PREFIX}/api/device/query/snap/${channel.deviceId}/${channel.channelId}`
}
</script>

<template>
  <view class="national-channel-list">
    <view class="channel-list-section">
      <!-- 加载状态 -->
      <LoadingState
        v-if="props.loading && props.channelList.length === 0" state="loading" loading-text="正在加载通道数据..."
        compact
      />

      <!-- 空状态 -->
      <LoadingState
        v-else-if="!props.loading && props.channelList.length === 0" state="empty" empty-text="暂无通道数据"
        empty-description="请检查设备连接状态或刷新重试" :show-retry="false" custom-icon="i-carbon-video" compact
      />

      <template v-else>
        <view
          v-for="channel in props.channelList" :key="channel.id" class="channel-list-item mb-24rpx"
          :class="{ 'channel-list-item--offline': !(channel.online ?? channel.status) }"
          @click="handleChannelSelect(channel)"
        >
          <view
            class="channel-card rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
          >
            <view
              class="card-gradient absolute h-128rpx w-128rpx rounded-full opacity-10 -right-32rpx -top-32rpx"
              :class="(channel.online ?? channel.status) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'"
            />

            <view class="channel-info relative z-10">
              <view class="channel-header mb-24rpx flex items-start justify-between">
                <view class="channel-basic-info flex-1">
                  <view class="channel-name mb-8rpx text-32rpx text-gray-800 font-semibold leading-tight">
                    {{ channel.name }}
                  </view>

                  <view class="channel-id mb-16rpx text-24rpx text-gray-500 font-mono">
                    通道编号: {{ channel.channelId }}
                  </view>
                </view>

                <view class="status-indicator flex items-center">
                  <view
                    class="status-dot mr-8rpx h-16rpx w-16rpx rounded-full"
                    :class="(channel.online ?? channel.status) ? 'bg-green-500' : 'bg-red-500'"
                  />
                  <text
                    class="status-text text-24rpx font-medium"
                    :class="(channel.online ?? channel.status) ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ getChannelStatusText(channel) }}
                  </text>
                </view>
              </view>
            </view>

            <view class="channel-details">
              <!-- 快照行 -->
              <view v-if="channel.online ?? channel.status" class="snapshot-row mt-16rpx">
                <view class="snapshot-container w-full">
                  <view class="snapshot-wrapper relative h-350rpx w-full overflow-hidden rounded-12rpx bg-gray-100">
                    <SmartImage
                      :src="getSnapshotUrl(channel)" class="smart-image-snapshot" height="350rpx" width="100%"
                      mode="aspectFit" border-radius="12rpx" :icon-size="128" :text-size="30" :show-state-text="true"
                      :enable-preview="false"
                    />
                  </view>
                </view>
              </view>
            </view>

            <view class="channel-actions flex items-center justify-between border-t border-gray-100 pt-24rpx">
              <view
                class="channel-type-badge rounded-12rpx px-16rpx py-8rpx text-20rpx font-medium"
                :class="getChannelTypeBadgeClasses(channel)"
              >
                {{ getChannelTypeText(channel) }}
              </view>

              <view
                class="detail-button flex items-center rounded-16rpx bg-blue-50 px-24rpx py-12rpx text-blue-600 transition-all duration-200"
                @click.stop="handleChannelSelect(channel)"
              >
                <text class="mr-8rpx text-24rpx font-medium">
                  查看详情
                </text>
                <view class="i-carbon-arrow-right h-20rpx w-20rpx" />
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.channel-list-item {
  position: relative;

  &--offline {
    opacity: 0.8;
  }
}

.channel-card {
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

  .detail-value {
    max-width: 400rpx;
    text-align: right;
    word-wrap: break-word;
    word-break: break-all;
  }
}

.channel-actions {
  .channel-type-badge {
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

// 新增：快照相关样式
.snapshot-row {
}

.snapshot-container {
  .snapshot-wrapper {
    border: 2rpx solid rgba(229, 231, 235, 0.6);
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
