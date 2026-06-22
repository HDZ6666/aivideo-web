<!-- 统一的加载状态组件 -->
<script setup lang="ts">
export type LoadingStateType = 'loading' | 'error' | 'empty' | 'success'

interface Props {
  /** 当前状态类型 */
  state: LoadingStateType
  /** 加载中的提示文字 */
  loadingText?: string
  /** 错误状态的提示文字 */
  errorText?: string
  /** 空状态的提示文字 */
  emptyText?: string
  /** 空状态的描述文字 */
  emptyDescription?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 重试按钮文字 */
  retryText?: string
  /** 自定义图标 */
  customIcon?: string
  /** 是否使用紧凑模式（较小的间距和尺寸） */
  compact?: boolean
}

interface Emits {
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: '加载中...',
  errorText: '加载失败',
  emptyText: '暂无数据',
  emptyDescription: '当前没有可显示的内容',
  showRetry: true,
  retryText: '重新加载',
  compact: false,
})

const emit = defineEmits<Emits>()

// 根据状态获取对应的图标和样式
const stateConfig = computed(() => {
  const baseConfig = {
    loading: {
      icon: 'i-carbon-circle-dash',
      iconClass: 'animate-spin text-blue-500',
      containerClass: 'bg-white shadow-gray-200/60 shadow-lg',
      containerSize: props.compact ? 'h-60rpx w-60rpx' : 'h-80rpx w-80rpx',
      iconSize: props.compact ? 'h-32rpx w-32rpx' : 'h-48rpx w-48rpx',
    },
    error: {
      icon: 'i-carbon-warning',
      iconClass: 'text-gray-400',
      containerClass: 'bg-gray-50 shadow-gray-300/50 shadow-inner',
      containerSize: props.compact ? 'h-80rpx w-80rpx' : 'h-120rpx w-120rpx',
      iconSize: props.compact ? 'h-40rpx w-40rpx' : 'h-64rpx w-64rpx',
    },
    empty: {
      icon: 'i-carbon-document-blank',
      iconClass: 'text-gray-400',
      containerClass: 'bg-gray-50 shadow-gray-300/50 shadow-inner',
      containerSize: props.compact ? 'h-80rpx w-80rpx' : 'h-120rpx w-120rpx',
      iconSize: props.compact ? 'h-40rpx w-40rpx' : 'h-64rpx w-64rpx',
    },
    success: {
      icon: 'i-carbon-checkmark',
      iconClass: 'text-green-500',
      containerClass: 'bg-green-50 shadow-green-200/60 shadow-lg',
      containerSize: props.compact ? 'h-60rpx w-60rpx' : 'h-80rpx w-80rpx',
      iconSize: props.compact ? 'h-32rpx w-32rpx' : 'h-48rpx w-48rpx',
    },
  }

  return baseConfig[props.state]
})

// 获取显示文字
const displayText = computed(() => {
  switch (props.state) {
    case 'loading':
      return props.loadingText
    case 'error':
      return props.errorText
    case 'empty':
      return props.emptyText
    case 'success':
      return '加载完成'
    default:
      return ''
  }
})

// 是否显示重试按钮
const shouldShowRetry = computed(() => {
  return props.showRetry && props.state === 'error'
})

// 是否显示描述文字
const shouldShowDescription = computed(() => {
  return props.state === 'empty' && props.emptyDescription
})

// 容器样式
const containerPadding = computed(() => {
  return props.compact ? 'py-80rpx' : 'py-120rpx'
})

// 间距样式
const spacing = computed(() => {
  return props.compact ? 'mb-24rpx' : 'mb-32rpx'
})

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <view class="loading-state-container">
    <view class="flex flex-col items-center justify-center" :class="containerPadding">
      <!-- 状态图标容器 -->
      <view
        class="flex items-center justify-center rounded-full"
        :class="[
          stateConfig.containerClass,
          stateConfig.containerSize,
          spacing,
          props.state === 'error' || props.state === 'empty' ? 'rounded-32rpx' : 'rounded-full',
        ]"
      >
        <view
          :class="[
            props.customIcon || stateConfig.icon,
            stateConfig.iconClass,
            stateConfig.iconSize,
          ]"
        />
      </view>

      <!-- 主要提示文字 -->
      <text class="text-gray-500" :class="props.compact ? 'text-24rpx' : 'text-28rpx'">
        {{ displayText }}
      </text>

      <!-- 描述文字（仅空状态显示） -->
      <text
        v-if="shouldShowDescription"
        class="text-gray-400"
        :class="[spacing, props.compact ? 'text-20rpx' : 'text-24rpx']"
      >
        {{ props.emptyDescription }}
      </text>

      <!-- 重试按钮（仅错误状态显示） -->
      <sar-button
        v-if="shouldShowRetry"
        type="outline"
        size="small"
        :class="spacing"
        @click="handleRetry"
      >
        {{ props.retryText }}
      </sar-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.loading-state-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
