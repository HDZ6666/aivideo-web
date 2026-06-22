<!-- 云台扫描控制组件 -->
<script lang="ts" setup>
// 导入统一的类型定义
import type { ScanParams } from '../types'
import { reactive, ref, watch } from 'vue'

import { ControlCommand } from '@/api/device'

// Props
interface Props {
  scanParams: ScanParams
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

// Events
interface Emits {
  'scan-set-speed': [speed: number]
  'scan-set-boundary': [groupId: number, boundary: number]
  'scan-start': [groupId: number]
  'stop': []
}

// 弹窗状态
const showScanPopup = ref(false)

// 本地扫描参数
const localScanParams = reactive<ScanParams>({
  groupId: props.scanParams.groupId,
  speed: props.scanParams.speed,
})

// 监听外部参数变化
watch(() => props.scanParams, (newParams) => {
  Object.assign(localScanParams, newParams)
}, { deep: true })

// 打开弹窗
function openPopup() {
  showScanPopup.value = true
}

// 关闭弹窗
function closePopup() {
  showScanPopup.value = false
}

// 扫描操作
function onScanSetSpeed() {
  emit('scan-set-speed', localScanParams.speed)
}

function onScanSetBoundary(boundary: string) {
  const boundaryValue = boundary === 'LEFT' ? ControlCommand.SCAN_LEFT_BOUNDARY : ControlCommand.SCAN_RIGHT_BOUNDARY
  emit('scan-set-boundary', localScanParams.groupId, boundaryValue)
}

function onScanStart() {
  emit('scan-start', localScanParams.groupId)
  closePopup()
}

function onStop() {
  emit('stop')
}
</script>

<template>
  <view class="ptz-scan-control">
    <!-- 扫描按钮 -->
    <view
      class="function-btn scan-btn"
      :class="{ disabled }"
      @click="!disabled && openPopup()"
    >
      <view class="i-carbon-scan h-24rpx w-24rpx" />
      <text class="btn-text">
        扫描
      </text>
    </view>

    <!-- 扫描弹出层 -->
    <sar-popup
      v-model:visible="showScanPopup"
      effect="zoom"
      :close-on-overlay-click="true"
      :safe-area-inset-bottom="true"
    >
      <view class="function-popup scan-popup">
        <!-- 弹窗标题 -->
        <view class="popup-header mb-32rpx flex items-center justify-between">
          <text class="popup-title text-32rpx text-gray-800 font-semibold">
            扫描控制
          </text>
          <view class="header-actions">
            <view class="close-btn" @click="closePopup()">
              <view class="i-carbon-close h-28rpx w-28rpx" />
            </view>
          </view>
        </view>

        <!-- 扫描速度设置 -->
        <view class="control-group mb-24rpx">
          <view class="control-item">
            <text class="item-label text-24rpx text-gray-600">
              扫描速度
            </text>
            <view class="item-controls flex items-center gap-12rpx">
              <sar-stepper v-model="localScanParams.speed" :min="1" :max="255" />
              <view class="control-actions">
                <view
                  class="mini-btn set-btn"
                  @click="onScanSetSpeed()"
                >
                  <text class="mini-btn-text">
                    设置
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 扫描组编号设置 -->
        <view class="control-group mb-24rpx">
          <view class="control-item">
            <text class="item-label text-24rpx text-gray-600">
              扫描组编号
            </text>
            <view class="item-controls flex items-center gap-12rpx">
              <sar-stepper v-model="localScanParams.groupId" :min="0" :max="255" />
              <view class="control-actions flex gap-8rpx">
                <view
                  class="mini-btn border-btn"
                  @click="onScanSetBoundary('LEFT')"
                >
                  <text class="mini-btn-text">
                    左边界
                  </text>
                </view>
                <view
                  class="mini-btn border-btn"
                  @click="onScanSetBoundary('RIGHT')"
                >
                  <text class="mini-btn-text">
                    右边界
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
            class="primary-btn scan-start-btn flex-1"
            @click="onScanStart()"
          >
            <view class="i-carbon-scan h-28rpx w-28rpx" />
            <text class="primary-btn-text">
              开始扫描
            </text>
          </view>
        </view>
      </view>
    </sar-popup>
  </view>
</template>

<style lang="scss" scoped>
.ptz-scan-control {
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

    &.scan-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      box-shadow: 0 3rpx 8rpx rgba(139, 92, 246, 0.15);

      &:active:not(.disabled) {
        box-shadow: 0 2rpx 6rpx rgba(139, 92, 246, 0.25);
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
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

  &.border-btn {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    box-shadow: 0 3rpx 8rpx rgba(6, 182, 212, 0.15);

    &:active {
      box-shadow: 0 2rpx 6rpx rgba(6, 182, 212, 0.25);
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
  &.scan-start-btn {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    box-shadow: 0 6rpx 16rpx rgba(139, 92, 246, 0.2);

    &:active {
      box-shadow: 0 3rpx 12rpx rgba(139, 92, 246, 0.3);
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
