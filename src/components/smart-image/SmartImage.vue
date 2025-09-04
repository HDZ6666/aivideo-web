<!-- SmartImage 智能图片组件 -->
<script setup lang="ts">
import type { ImageLoadState, SmartImageEmits, SmartImageProps } from './types'

defineOptions({
  name: 'SmartImage',
})

const props = withDefaults(defineProps<SmartImageProps>(), {
  enablePreview: true,
  mode: 'aspectFill',
  borderRadius: '0',
  iconSize: '48rpx',
  showStateText: false,
  textSize: '24rpx',
  loadingDelay: 200,
})

const emit = defineEmits<SmartImageEmits>()

// 图片加载状态
const loadState = ref<ImageLoadState>('loading')
const imageRef = ref<HTMLImageElement>()
// 是否显示加载状态（用于延迟显示）
const showLoadingState = ref(false)
// 延迟显示定时器
let loadingTimer: ReturnType<typeof setTimeout> | null = null

// ========== 样式计算属性统一管理 ==========

// 容器样式
const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}rpx` : props.width
  }

  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}rpx` : props.height
  }

  if (props.borderRadius) {
    style.borderRadius = props.borderRadius
  }

  return style
})

// 容器样式类
const containerClass = computed(() => {
  const classes = ['smart-image-container', 'relative', 'overflow-hidden']

  if (props.borderRadius) {
    classes.push('rounded')
  }

  return classes
})

// 状态图标样式
const iconStyle = computed(() => {
  const size = typeof props.iconSize === 'number' ? `${props.iconSize}rpx` : props.iconSize
  return {
    width: size,
    height: size,
  }
})

// 状态文字样式
const textStyle = computed(() => {
  const size = typeof props.textSize === 'number' ? `${props.textSize}rpx` : props.textSize
  return {
    fontSize: size,
  }
})

// 状态配置
const stateConfig = computed(() => {
  const configs = {
    loading: {
      icon: 'i-carbon-image',
      iconClass: 'text-gray-400',
      bgClass: '',
      text: '加载中...',
    },
    error: {
      icon: 'i-carbon-no-image',
      iconClass: 'text-gray-400',
      bgClass: '',
      text: '加载失败',
    },
    success: {
      icon: '',
      iconClass: '',
      bgClass: '',
      text: '',
    },
  }

  return configs[loadState.value]
})

// 是否可以预览
const canPreview = computed(() => {
  return props.enablePreview && loadState.value === 'success'
})

// 图片样式类
const imageClass = computed(() => {
  const classes = ['smart-image', 'h-full', 'w-full', 'transition-opacity', 'duration-300']

  if (canPreview.value) {
    classes.push('cursor-pointer')
  }

  return classes
})

// 是否应该显示状态（加载中或错误）
const shouldShowState = computed(() => {
  // 如果 src 为空，直接显示默认图标
  if (!props.src) {
    return true
  }

  // 如果是错误状态，显示错误图标
  if (loadState.value === 'error') {
    return true
  }

  // 如果是加载中状态，需要延迟显示
  if (loadState.value === 'loading') {
    return showLoadingState.value
  }

  return false
})

// 当前显示的图片源
const currentImageSrc = computed(() => {
  return props.src
})

// 清除延迟定时器
function clearLoadingTimer() {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
}

// 处理图片加载成功
function handleImageLoad(event: any) {
  clearLoadingTimer()
  showLoadingState.value = false
  loadState.value = 'success'
  emit('load', event)
}

// 处理图片加载失败
function handleImageError(event: any) {
  clearLoadingTimer()
  showLoadingState.value = false
  loadState.value = 'error'
  emit('error', event)
}

// 处理图片预览
function handlePreview() {
  if (!canPreview.value)
    return

  uni.previewImage({
    urls: [props.src],
    current: props.src,
    fail: (err) => {
      console.error('图片预览失败:', err)
      uni.showToast({
        title: '预览失败',
        icon: 'error',
      })
    },
  })
}

// 重置状态（当 src 改变时）
watch(() => props.src, (newSrc, oldSrc) => {
  // 清除之前的定时器
  clearLoadingTimer()

  // 如果 src 为空，直接显示默认状态
  if (!newSrc) {
    loadState.value = 'loading'
    showLoadingState.value = true
    return
  }

  // 如果是首次加载（oldSrc 为 undefined），立即显示加载状态
  if (oldSrc === undefined) {
    loadState.value = 'loading'
    showLoadingState.value = true
    return
  }

  // 如果是切换图片，延迟显示加载状态
  loadState.value = 'loading'
  showLoadingState.value = false

  // 设置延迟显示定时器
  loadingTimer = setTimeout(() => {
    if (loadState.value === 'loading') {
      showLoadingState.value = true
    }
  }, props.loadingDelay)
}, { immediate: true })

// 组件销毁时清理定时器
onUnmounted(() => {
  clearLoadingTimer()
})
</script>

<template>
  <view :class="containerClass" :style="containerStyle">
    <!-- 主图片内容 -->
    <image
      v-show="loadState === 'success'"
      ref="imageRef"
      :src="currentImageSrc"
      :mode="mode"
      :class="imageClass"
      @load="handleImageLoad"
      @error="handleImageError"
      @click="handlePreview"
    />

    <!-- 加载中和错误状态 -->
    <view
      v-show="shouldShowState"
      class="state-overlay absolute inset-0 flex items-center justify-center transition-all duration-300"
      :class="[stateConfig.bgClass, showStateText ? 'flex-col' : '']"
    >
      <!-- 状态图标 -->
      <view
        class="state-icon flex items-center justify-center"
        :class="[stateConfig.iconClass, showStateText ? 'mb-16rpx' : '']"
      >
        <view :class="stateConfig.icon" :style="iconStyle" />
      </view>

      <!-- 状态文字 -->
      <text
        v-if="showStateText && stateConfig.text"
        class="state-text text-gray-500"
        :style="textStyle"
      >
        {{ stateConfig.text }}
      </text>
    </view>

    <!-- 预览提示（仅在成功加载且启用预览时显示） -->
    <view
      v-if="canPreview"
      class="preview-overlay absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200"
      @click="handlePreview"
    >
      <view class="preview-icon h-48rpx w-48rpx text-white">
        <view class="i-carbon-view h-full w-full" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.smart-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50rpx;
  min-width: 50rpx;

  .smart-image {
    display: block;

    &.cursor-pointer {
      cursor: pointer;
    }
  }

  .state-icon {
    // 简化图标样式，不需要背景和阴影
  }

  .preview-overlay {
    cursor: pointer;

    &:hover {
      opacity: 1 !important;
    }

    .preview-icon {
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4rpx);
    }
  }

  // 鼠标悬停效果（仅在支持的平台）
  &:hover {
    .preview-overlay {
      opacity: 1;
    }
  }

  // 点击效果
  &:active {
    .smart-image {
      transform: scale(0.98);
    }

    .preview-overlay {
      opacity: 1;
    }
  }
}
</style>
