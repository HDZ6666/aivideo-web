<!-- 云台方向控制组件 -->
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
  'direction-control': [direction: PtzCommand]
}

// 方向控制开始
function onDirectionStart(direction: string) {
  const ptzCommand = PtzCommand[direction as keyof typeof PtzCommand]
  emit('direction-control', ptzCommand)
}

// 方向控制停止
function onDirectionStop() {
  emit('direction-control', PtzCommand.STOP)
}
</script>

<template>
  <view class="ptz-direction-control">
    <text class="section-label mb-16rpx block text-center text-24rpx text-gray-600">
      方向控制
    </text>
    <view class="direction-grid">
      <!-- 上 -->
      <view class="grid-row mb-16rpx flex justify-center">
        <view
          class="direction-btn ptz-btn"
          :class="{ disabled }"
          @touchstart="!disabled && onDirectionStart('UP')"
          @touchend="!disabled && onDirectionStop()"
        >
          <view class="i-carbon-arrow-up h-36rpx w-36rpx" />
        </view>
      </view>

      <!-- 左、停止、右 -->
      <view class="grid-row mb-16rpx flex items-center justify-between gap-16rpx">
        <view
          class="ptz-btn direction-btn"
          :class="{ disabled }"
          @touchstart="!disabled && onDirectionStart('LEFT')"
          @touchend="!disabled && onDirectionStop()"
        >
          <view class="i-carbon-arrow-left h-36rpx w-36rpx" />
        </view>

        <view
          class="ptz-btn stop-btn"
          :class="{ disabled }"
          @click="!disabled && onDirectionStop()"
        >
          <view class="i-carbon-stop h-36rpx w-36rpx" />
        </view>

        <view
          class="ptz-btn direction-btn"
          :class="{ disabled }"
          @touchstart="!disabled && onDirectionStart('RIGHT')"
          @touchend="!disabled && onDirectionStop()"
        >
          <view class="i-carbon-arrow-right h-36rpx w-36rpx" />
        </view>
      </view>

      <!-- 下 -->
      <view class="grid-row flex justify-center">
        <view
          class="ptz-btn direction-btn"
          :class="{ disabled }"
          @touchstart="!disabled && onDirectionStart('DOWN')"
          @touchend="!disabled && onDirectionStop()"
        >
          <view class="i-carbon-arrow-down h-36rpx w-36rpx" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ptz-direction-control {
  .direction-grid {
    width: 260rpx;
  }

  .ptz-btn {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22rpx;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.15);
    position: relative;
    overflow: hidden;

    &.direction-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);

      &:active:not(.disabled) {
        transform: scale(0.92);
        box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.25);
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
    }

    &.stop-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.15);

      &:active:not(.disabled) {
        transform: scale(0.92);
        box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.25);
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
