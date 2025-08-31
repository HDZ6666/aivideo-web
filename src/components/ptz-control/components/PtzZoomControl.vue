<!-- 云台变焦控制组件 -->
<script lang="ts" setup>
import { PtzCommand } from '@/api/device'

// Props
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

// Events
interface Emits {
  'zoom-control': [direction: PtzCommand]
}

// 变焦控制开始
function onZoomStart(direction: string) {
  const ptzCommand = PtzCommand[direction as keyof typeof PtzCommand]
  emit('zoom-control', ptzCommand)
}

// 变焦控制停止
function onZoomStop() {
  emit('zoom-control', PtzCommand.STOP)
}
</script>

<template>
  <view class="ptz-zoom-control">
    <text class="section-label mb-16rpx block text-center text-24rpx text-gray-600">
      变焦控制
    </text>
    <view class="zoom-buttons flex flex-col gap-16rpx">
      <view
        class="zoom-btn zoom-in-btn"
        :class="{ disabled }"
        @touchstart="!disabled && onZoomStart('ZOOM_IN')"
        @touchend="!disabled && onZoomStop()"
      >
        <view class="i-carbon-zoom-in h-40rpx w-40rpx" />
      </view>
      <view
        class="zoom-btn zoom-out-btn"
        :class="{ disabled }"
        @touchstart="!disabled && onZoomStart('ZOOM_OUT')"
        @touchend="!disabled && onZoomStop()"
      >
        <view class="i-carbon-zoom-out h-40rpx w-40rpx" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ptz-zoom-control {
  .zoom-btn {
    width: 140rpx;
    height: 72rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    border-radius: 20rpx;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &.zoom-in-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.15);
    }

    &.zoom-out-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.15);
    }

    &:active:not(.disabled) {
      transform: scale(0.92);

      &.zoom-in-btn {
        box-shadow: 0 2rpx 8rpx rgba(16, 185, 129, 0.25);
      }

      &.zoom-out-btn {
        box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.25);
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-radius: inherit;
    }

    view {
      color: white;
      position: relative;
      z-index: 1;
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:active {
        transform: none;
      }
    }
  }
}
</style>
