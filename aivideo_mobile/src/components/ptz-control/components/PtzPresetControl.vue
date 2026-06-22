<!-- 云台预设控制组件 -->
<script lang="ts" setup>
import { ref, watch } from 'vue'

// Props
interface Props {
  presetId: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

// Events
interface Emits {
  'preset-set': [id: number]
  'preset-call': [id: number]
  'preset-delete': [id: number]
  'stop': []
}

// 弹窗状态
const showPresetPopup = ref(false)

// 本地预设ID
const localPresetId = ref(props.presetId)

// 监听外部预设ID变化
watch(() => props.presetId, (newId) => {
  localPresetId.value = newId
})

// 打开弹窗
function openPopup() {
  showPresetPopup.value = true
}

// 关闭弹窗
function closePopup() {
  showPresetPopup.value = false
}

// 预设操作
function onPresetSet() {
  emit('preset-set', localPresetId.value)
}

function onPresetCall() {
  emit('preset-call', localPresetId.value)
  closePopup()
}

function onPresetDelete() {
  emit('preset-delete', localPresetId.value)
}

function onStop() {
  emit('stop')
}
</script>

<template>
  <view class="ptz-preset-control">
    <!-- 预设按钮 -->
    <view
      class="function-btn preset-btn"
      :class="{ disabled }"
      @click="!disabled && openPopup()"
    >
      <view class="i-carbon-location h-24rpx w-24rpx" />
      <text class="btn-text">
        预设
      </text>
    </view>

    <!-- 预设弹出层 -->
    <sar-popup
      v-model:visible="showPresetPopup"
      effect="zoom"
      :close-on-overlay-click="true"
      :safe-area-inset-bottom="true"
    >
      <view class="function-popup preset-popup">
        <!-- 弹窗标题 -->
        <view class="popup-header mb-32rpx flex items-center justify-between">
          <text class="popup-title text-32rpx text-gray-800 font-semibold">
            位置预设
          </text>
          <view class="header-actions">
            <view class="close-btn" @click="closePopup()">
              <view class="i-carbon-close h-28rpx w-28rpx" />
            </view>
          </view>
        </view>

        <!-- 预置位编号设置 -->
        <view class="control-group mb-32rpx">
          <view class="control-item">
            <text class="item-label text-26rpx text-gray-600 font-medium">
              预置位编号
            </text>
            <view class="item-controls flex items-center gap-12rpx">
              <sar-stepper v-model="localPresetId" :min="1" :max="255" />
              <view class="control-actions flex gap-8rpx">
                <view
                  class="mini-btn set-btn"
                  @click="onPresetSet()"
                >
                  <text class="mini-btn-text">
                    设置
                  </text>
                </view>
                <view
                  class="mini-btn delete-btn"
                  @click="onPresetDelete()"
                >
                  <text class="mini-btn-text">
                    删除
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部按钮区域 -->
        <view class="popup-bottom-actions flex gap-16rpx">
          <view class="secondary-btn stop-btn flex-1" @click="onStop()">
            <view class="i-carbon-stop h-28rpx w-28rpx" />
            <text class="secondary-btn-text">
              停止
            </text>
          </view>
          <view
            class="primary-btn preset-call-btn flex-1"
            @click="onPresetCall()"
          >
            <view class="i-carbon-location h-28rpx w-28rpx" />
            <text class="primary-btn-text">
              调用预置点
            </text>
          </view>
        </view>
      </view>
    </sar-popup>
  </view>
</template>

<style lang="scss" scoped>
.ptz-preset-control {
  .function-btn {
    width: 140rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    border-radius: 16rpx;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);

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

    view,
    .btn-text {
      color: white;
      position: relative;
      z-index: 1;
    }

    .btn-text {
      font-size: 22rpx;
      font-weight: 600;
    }

    &:active:not(.disabled) {
      transform: scale(0.92);
    }

    &.preset-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      box-shadow: 0 3rpx 8rpx rgba(59, 130, 246, 0.15);

      &:active:not(.disabled) {
        box-shadow: 0 2rpx 6rpx rgba(59, 130, 246, 0.25);
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

// 弹窗样式
.function-popup {
  width: 90vw;
  max-width: 600rpx;
  max-height: 80vh;
  background: white;
  border-radius: 32rpx;
  padding: 32rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: -50rpx;
    right: -50rpx;
    width: 200rpx;
    height: 200rpx;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 50%;
    opacity: 0.1;
    z-index: 0;
  }

  .popup-header {
    position: relative;
    z-index: 1;

    .header-actions {
      .close-btn {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16rpx;
        background: #f3f4f6;
        transition: all 0.2s ease;

        &:active {
          background: #e5e7eb;
          transform: scale(0.95);
        }

        view {
          color: #6b7280;
        }
      }
    }
  }

  .control-group {
    position: relative;
    z-index: 1;

    .control-item {
      .item-label {
        font-weight: 500;
        margin-bottom: 12rpx;
        display: block;
      }

      .item-controls {
        .control-actions {
          flex-shrink: 0;
        }
      }
    }
  }

  .popup-bottom-actions {
    position: relative;
    z-index: 1;
    margin-top: 32rpx;
  }
}

// 按钮样式
.mini-btn {
  height: 56rpx;
  padding: 0 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  transition: all 0.2s ease;
  box-shadow: 0 3rpx 8rpx rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: inherit;
  }

  view,
  .mini-btn-text {
    position: relative;
    z-index: 1;
    color: white;
  }

  .mini-btn-text {
    font-size: 20rpx;
    font-weight: 600;
  }

  &:active {
    transform: scale(0.95);
  }

  &.set-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 3rpx 8rpx rgba(16, 185, 129, 0.15);

    &:active {
      box-shadow: 0 2rpx 6rpx rgba(16, 185, 129, 0.25);
    }
  }

  &.delete-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 3rpx 8rpx rgba(239, 68, 68, 0.15);

    &:active {
      box-shadow: 0 2rpx 6rpx rgba(239, 68, 68, 0.25);
    }
  }
}

.primary-btn,
.secondary-btn {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border-radius: 18rpx;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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

  view,
  .primary-btn-text,
  .secondary-btn-text {
    position: relative;
    z-index: 1;
    color: white;
  }

  .primary-btn-text,
  .secondary-btn-text {
    font-size: 24rpx;
    font-weight: 600;
  }

  &:active {
    transform: scale(0.95);
  }
}

.primary-btn {
  &.preset-call-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    box-shadow: 0 6rpx 16rpx rgba(59, 130, 246, 0.2);

    &:active {
      box-shadow: 0 3rpx 12rpx rgba(59, 130, 246, 0.3);
    }
  }
}

.secondary-btn {
  &.stop-btn {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 6rpx 16rpx rgba(239, 68, 68, 0.2);

    &:active {
      box-shadow: 0 3rpx 12rpx rgba(239, 68, 68, 0.3);
    }
  }
}
</style>
