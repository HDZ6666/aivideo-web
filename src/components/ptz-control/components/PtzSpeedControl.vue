<!-- 云台速度控制组件 -->
<script lang="ts" setup>
import { ref, watch } from 'vue'

// Props
interface Props {
  speed: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

// Events
interface Emits {
  'speed-change': [speed: number]
}

// 本地速度值
const localSpeed = ref(props.speed)

// 监听外部速度变化
watch(() => props.speed, (newSpeed) => {
  localSpeed.value = newSpeed
})

// 速度变化处理
function onSpeedChange(event: any) {
  const newSpeed = event.detail.value
  localSpeed.value = newSpeed
  emit('speed-change', newSpeed)
}
</script>

<template>
  <view class="ptz-speed-control">
    <!-- 速度控制 -->
    <view class="speed-section mb-32rpx">
      <text class="section-label mb-16rpx block text-24rpx text-gray-600">
        控制速度
      </text>
      <view class="speed-controls flex items-center gap-16rpx">
        <text class="speed-label text-28rpx text-gray-600 font-medium">
          慢
        </text>
        <slider
          class="speed-slider flex-1"
          :value="localSpeed"
          :min="1"
          :max="255"
          :disabled="disabled"
          active-color="#3b82f6"
          background-color="#e5e7eb"
          @change="onSpeedChange"
        />
        <text class="speed-label text-28rpx text-gray-600 font-medium">
          快
        </text>
        <text class="speed-value min-w-60rpx text-center text-24rpx text-blue-600 font-bold">
          {{ localSpeed }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ptz-speed-control {
  .speed-section {
    .section-label {
      font-weight: 500;
      margin-bottom: 12rpx;
      display: block;
    }

    .speed-controls {
      .speed-label {
        font-weight: 500;
        color: #6b7280;
      }

      .speed-slider {
        flex: 1;
      }

      .speed-value {
        min-width: 60rpx;
        text-align: center;
        font-weight: 700;
        color: #3b82f6;
      }
    }
  }
}
</style>
