<!-- 设备统计卡片组件 -->
<script setup lang="ts">
interface DeviceStats {
  /** 国标设备总数 */
  nationalDevices: number
  /** 通道总数量 */
  totalChannels: number
  /** 在线通道数 */
  onlineChannels: number
  /** 非国标设备数 */
  proxyDevices: number
}

interface Props {
  stats: DeviceStats
}

const props = defineProps<Props>()
</script>

<template>
  <view class="stats-section">
    <view class="grid grid-cols-2 gap-24rpx">
      <!-- 国标设备总数 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-blue-50">
            <view class="i-carbon-devices h-40rpx w-40rpx text-blue-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-gray-800 font-bold">
              {{ props.stats.nationalDevices }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              国标设备
            </text>
          </view>
        </view>
      </view>

      <!-- 通道总数量 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-purple-50">
            <view class="i-carbon-video h-40rpx w-40rpx text-purple-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-gray-800 font-bold">
              {{ props.stats.totalChannels }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              通道总数
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="grid grid-cols-2 mt-24rpx gap-24rpx">
      <!-- 在线通道数 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-green-50">
            <view class="i-carbon-play h-40rpx w-40rpx text-green-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-green-600 font-bold">
              {{ props.stats.onlineChannels }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              在线通道
            </text>
          </view>
        </view>
      </view>

      <!-- 非国标设备数 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-orange-50">
            <view class="i-carbon-network-3 h-40rpx w-40rpx text-orange-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-orange-600 font-bold">
              {{ props.stats.proxyDevices }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              非国标设备
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.stats-card {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow:
      inset 4rpx 4rpx 8rpx rgba(163, 177, 198, 0.4),
      inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.8);
  }
}
</style>
