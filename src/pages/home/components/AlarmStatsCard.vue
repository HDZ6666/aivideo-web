<!-- 告警统计卡片组件 -->
<script setup lang="ts">
interface AlarmStats {
  /** 当日告警数 */
  todayAlarms: number
  /** 当日未处理 */
  todayUnprocessed: number
  /** 近7天告警数 */
  last7DaysAlarms: number
  /** 近7天未处理 */
  last7DaysUnprocessed: number
}

interface Props {
  stats: AlarmStats
}

const props = defineProps<Props>()
</script>

<template>
  <view class="stats-section">
    <view class="grid grid-cols-2 gap-24rpx">
      <!-- 当日告警数 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-red-50">
            <view class="i-carbon-warning h-40rpx w-40rpx text-red-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-gray-800 font-bold">
              {{ props.stats.todayAlarms }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              当日告警
            </text>
          </view>
        </view>
      </view>

      <!-- 当日未处理 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-orange-50">
            <view class="i-carbon-time h-40rpx w-40rpx text-orange-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-orange-600 font-bold">
              {{ props.stats.todayUnprocessed }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              当日未处理
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="grid grid-cols-2 mt-24rpx gap-24rpx">
      <!-- 近7天告警数 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-blue-50">
            <view class="i-carbon-calendar h-40rpx w-40rpx text-blue-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-blue-600 font-bold">
              {{ props.stats.last7DaysAlarms }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              近7天告警
            </text>
          </view>
        </view>
      </view>

      <!-- 近7天未处理 -->
      <view class="stats-card rounded-16rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
        <view class="flex items-center">
          <view class="stats-icon mr-16rpx h-60rpx w-60rpx flex items-center justify-center rounded-12rpx bg-purple-50">
            <view class="i-carbon-pending h-40rpx w-40rpx text-purple-500" />
          </view>
          <view class="flex-1">
            <text class="stats-value block text-36rpx text-purple-600 font-bold">
              {{ props.stats.last7DaysUnprocessed }}
            </text>
            <text class="stats-label text-24rpx text-gray-500">
              近7天未处理
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
