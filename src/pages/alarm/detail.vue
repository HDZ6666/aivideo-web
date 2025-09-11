<route lang="jsonc" type="page">
{
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "告警详情"
  }
}
</route>

<script lang="ts" setup>
import type { IAlarmDetailRes } from '@/api/alarm'
import { AlarmStatus, getAlarmDetailByID, updateAlarmStatusByID } from '@/api/alarm'
import { LoadingState } from '@/components/loading-state'
import { HlsPlayer } from '@/components/player'
import { SmartImage } from '@/components/smart-image'
import { useAlarmStore } from '@/store/alarm'

import { formatTime } from '@/utils'

defineOptions({
  name: 'AlarmDetail',
})

// 使用告警状态管理
const alarmStore = useAlarmStore()

const alarmDetail = ref<IAlarmDetailRes | null>(null)
const loading = ref(false)
const updatingStatus = ref(false)
const showVideo = ref(false) // 控制显示图片还是视频
const currentImageIndex = ref(0) // 当前显示的图片索引
const paging = ref() // z-paging 引用
const hlsPlayerRef = ref() // HLS播放器引用

const alarmItem = computed(() => alarmStore.selectedAlarm)
const alarmId = ref(undefined)

// 计算属性：获取告警图片列表
const alarmImages = computed(() => {
  if (!alarmDetail.value?.alarm_img)
    return []

  // 如果是单张图片，返回数组
  if (typeof alarmDetail.value.alarm_img === 'string') {
    return [alarmDetail.value.alarm_img]
  }

  // 如果是多张图片数组
  if (Array.isArray(alarmDetail.value.alarm_img)) {
    return alarmDetail.value.alarm_img
  }

  return []
})

// 计算属性：当前显示的图片
const currentImage = computed(() => {
  const images = alarmImages.value
  if (images.length === 0)
    return ''
  return images[currentImageIndex.value] || images[0]
})

// 获取状态显示信息
function getStatusInfo(status: AlarmStatus) {
  switch (status) {
    case AlarmStatus.UNPROCESSED:
      return { text: '未处理', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: 'i-carbon-time' }
    case AlarmStatus.PROCESSED:
      return { text: '已处理', color: 'text-green-600', bgColor: 'bg-green-50', icon: 'i-carbon-checkmark' }
    case AlarmStatus.FALSE_ALARM:
      return { text: '误报', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: 'i-carbon-close' }
    default:
      return { text: '未知', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: 'i-carbon-help' }
  }
}

// 下拉刷新
async function onRefresh() {
  if (!alarmId.value) {
    paging.value?.complete()
    return
  }

  try {
    await loadAlarmDetail()
  }
  catch (error) {
    console.error('刷新失败:', error)
  }
  finally {
    paging.value?.complete()
  }
}

// 加载告警详情
async function loadAlarmDetail() {
  try {
    loading.value = true
    const response = await getAlarmDetailByID({ alarm_id: alarmId.value })
    alarmDetail.value = response
  }
  catch (error) {
    console.error('加载告警详情失败:', error)
  }
  finally {
    loading.value = false
  }
}

// 更新告警状态
async function updateStatus(newStatus: AlarmStatus) {
  try {
    updatingStatus.value = true

    await updateAlarmStatusByID({
      alarmId: alarmDetail.value.alarm_id,
      status: newStatus,
    })
    // 更新本地状态
    alarmDetail.value.status = newStatus
    // 同步更新 store 中的选中告警状态
    if (alarmStore.selectedAlarm && alarmStore.selectedAlarm.id === alarmDetail.value.alarm_id) {
      alarmStore.setSelectedAlarm({
        ...alarmStore.selectedAlarm,
        status: newStatus,
      })
    }
  }
  catch (error) {
    console.error('更新告警状态失败:', error)
  }
  finally {
    updatingStatus.value = false
  }
}

// 切换到指定图片
function switchToImage(index: number) {
  if (index >= 0 && index < alarmImages.value.length) {
    currentImageIndex.value = index
  }
}

// 切换图片/视频显示
function toggleMediaType() {
  if (!alarmDetail.value?.videoUrl && !showVideo.value) {
    uni.showToast({
      title: '暂无视频资源',
      icon: 'none',
    })
    return
  }
  showVideo.value = !showVideo.value
}

// HLS播放器就绪
function onHlsReady() {
  console.log('告警视频播放就绪')
}

// HLS播放器错误
function onHlsError(error: any) {
  console.error('告警视频播放错误:', error)
}

// 返回上一页
function goBack() {
  // 获取当前页面栈
  const pages = getCurrentPages()
  console.log('pages:', pages)

  // 如果页面栈长度大于1，说明有历史记录，可以返回
  if (pages.length > 1) {
    uni.navigateBack()
  }
  else {
    // 没有历史记录，跳转到告警列表页
    uni.reLaunch({
      url: '/pages/alarm/index',
    })
  }
}

onLoad((options) => {
  if (alarmItem.value || options.id) {
    alarmId.value = options.id ? Number.parseInt(options.id) : alarmItem.value.id
    loadAlarmDetail()
  }
})
</script>

<template>
  <view class="alarm-detail-page bg-gray-50">
    <!-- 导航栏 -->
    <sar-navbar title="告警详情" class="navbar-custom">
      <template #left>
        <view class="back-button">
          <view class="i-carbon-arrow-left h-40rpx w-40rpx text-gray-600" @click="goBack" />
        </view>
      </template>
    </sar-navbar>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <z-paging ref="paging" :fixed="false" refresher-only @on-refresh="onRefresh">
        <!-- 加载状态 -->
        <LoadingState v-if="loading" state="loading" loading-text="正在加载告警详情..." />

        <!-- 告警详情内容 -->
        <view v-else-if="alarmDetail" class="content-wrapper">
          <!-- 告警头部 -->
          <view class="alarm-media-section mb-32rpx">
            <!-- 顶部控制区域 -->
            <view class="media-controls mb-16rpx flex items-center justify-between">
              <!-- 左侧：模式切换开关 -->
              <view class="mode-switch">
                <view class="switch-container rounded-full bg-white p-4rpx shadow-gray-200/60 shadow-lg">
                  <view class="switch-track relative flex rounded-full bg-gray-100">
                    <!-- 滑块背景 -->
                    <view
                      class="switch-slider absolute h-full rounded-full bg-blue-500 transition-all duration-300"
                      :class="showVideo ? 'translate-x-full' : 'translate-x-0'" :style="{ width: '50%' }"
                    />

                    <!-- 图片选项 -->
                    <view
                      class="switch-option relative z-10 flex flex-1 items-center justify-center px-16rpx py-8rpx"
                      @click="!showVideo || toggleMediaType()"
                    >
                      <view
                        class="mr-6rpx h-20rpx w-20rpx"
                        :class="!showVideo ? 'i-carbon-image text-white' : 'i-carbon-image text-gray-600'"
                      />
                      <text class="text-24rpx font-medium" :class="!showVideo ? 'text-white' : 'text-gray-600'">
                        图片
                      </text>
                    </view>

                    <!-- 视频选项 -->
                    <view
                      class="switch-option relative z-10 flex flex-1 items-center justify-center px-16rpx py-8rpx"
                      @click="showVideo || toggleMediaType()"
                    >
                      <view
                        class="mr-6rpx h-20rpx w-20rpx"
                        :class="showVideo ? 'i-carbon-video text-white' : 'i-carbon-video text-gray-600'"
                      />
                      <text class="text-24rpx font-medium" :class="showVideo ? 'text-white' : 'text-gray-600'">
                        视频
                      </text>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 右侧：缩略图区域 -->
              <view class="thumbnail-panel">
                <!-- 图片模式：横向滚动缩略图 -->
                <view v-if="!showVideo" class="thumbnail-container">
                  <view class="thumbnail-list">
                    <view
                      v-for="(image, index) in alarmImages" :key="index" class="thumbnail-item"
                      :class="{ active: index === currentImageIndex }" @click="switchToImage(index)"
                    >
                      <SmartImage
                        :src="image"
                        class="thumbnail-image"
                        width="74rpx"
                        height="74rpx"
                        mode="aspectFill"
                        border-radius="6rpx"
                        :enable-preview="false"
                      />
                    </view>
                  </view>
                </view>

                <!-- 视频模式：固定高度提示区域 -->
                <view v-else class="video-info">
                  <view class="video-content">
                    <view class="i-carbon-video video-icon" />
                    <text class="video-text">
                      视频模式
                    </text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 主媒体容器 -->
            <view class="media-container relative overflow-hidden rounded-24rpx">
              <!-- 告警图片 -->
              <view v-if="!showVideo" class="media-content">
                <!-- 主图片容器 - 固定高度 -->
                <view class="main-media-container rounded-24rpx bg-white shadow-gray-200/60 shadow-lg">
                  <SmartImage
                    :src="currentImage"
                    class="alarm-image"
                    height="400rpx"
                    width="100%"
                    mode="aspectFill"
                    border-radius="24rpx"
                    :icon-size="128"
                    :text-size="28"
                    :show-state-text="true"
                    :enable-preview="true"
                  />
                </view>
              </view>

              <!-- 告警视频 -->
              <view v-else class="media-content">
                <!-- 视频容器 - 与图片容器相同高度 -->
                <view class="main-media-container rounded-24rpx bg-white shadow-gray-200/60 shadow-lg">
                  <view v-if="alarmDetail.videoUrl" class="video-player-container h-400rpx w-full overflow-hidden rounded-24rpx">
                    <HlsPlayer
                      ref="hlsPlayerRef"
                      :src="alarmDetail.videoUrl"
                      class="alarm-video h-full w-full"
                      @ready="onHlsReady"
                      @error="onHlsError"
                    />
                  </view>
                  <view
                    v-else
                    class="no-video h-400rpx w-full flex items-center justify-center rounded-24rpx bg-gray-100"
                  >
                    <text class="text-gray-500">
                      暂无视频资源
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 告警详情信息卡片 - 合并基本信息、通道信息、通知信息 -->
          <view class="alarm-info-card mb-32rpx rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg">
            <!-- 装饰性渐变背景 -->
            <view
              class="card-gradient absolute h-128rpx w-150rpx rounded-full opacity-10 -right-32rpx -top-32rpx" :class="getStatusInfo(alarmDetail.status).color === 'text-green-600' ? 'bg-gradient-to-br from-green-400 to-green-600'
                : getStatusInfo(alarmDetail.status).color === 'text-orange-600' ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                  : 'bg-gradient-to-br from-red-400 to-red-600'"
            />

            <!-- 卡片头部 -->
            <view class="card-header relative z-10 mb-32rpx flex items-start justify-between">
              <view class="alarm-basic-info flex-1">
                <!-- 告警类型标题 -->
                <view class="alarm-title mb-8rpx text-36rpx text-gray-800 font-semibold leading-tight">
                  {{ alarmDetail.modelname || '未知告警类型' }}
                </view>

                <!-- 告警ID -->
                <view class="alarm-id mb-16rpx text-28rpx text-gray-500 font-mono">
                  告警ID: {{ alarmDetail.alarm_id }}
                </view>
              </view>

              <!-- 告警状态指示器 -->
              <view class="status-indicator flex items-center">
                <view
                  class="status-dot mr-12rpx h-20rpx w-20rpx rounded-full" :class="getStatusInfo(alarmDetail.status).color === 'text-green-600' ? 'bg-green-500'
                    : getStatusInfo(alarmDetail.status).color === 'text-orange-600' ? 'bg-orange-500' : 'bg-red-500'"
                />
                <text class="status-text text-28rpx font-medium" :class="getStatusInfo(alarmDetail.status).color">
                  {{ getStatusInfo(alarmDetail.status).text }}
                </text>
              </view>
            </view>

            <!-- 告警详情信息主体 -->
            <view class="alarm-info relative z-10">
              <view class="info-items">
                <!-- 设备名称 -->
                <view class="info-item flex items-center justify-between py-12rpx">
                  <text class="item-label text-28rpx text-gray-500">
                    设备名称
                  </text>
                  <text class="item-value text-28rpx text-gray-700 font-medium">
                    {{ alarmDetail.device_name || '未知设备' }}
                  </text>
                </view>

                <!-- 告警时间 -->
                <view class="info-item flex items-center justify-between py-12rpx">
                  <text class="item-label text-28rpx text-gray-500">
                    告警时间
                  </text>
                  <text class="item-value text-28rpx text-gray-700 font-medium">
                    {{ formatTime(alarmDetail.alarm_time) }}
                  </text>
                </view>

                <!-- 设备地址 -->
                <view v-if="alarmDetail.address" class="info-item flex items-center justify-between py-12rpx">
                  <text class="item-label text-28rpx text-gray-500">
                    设备地址
                  </text>
                  <text class="item-value text-28rpx text-gray-700 font-medium">
                    {{ alarmDetail.address }}
                  </text>
                </view>
              </view>
            </view>
          </view>

          <!-- 功能按钮区域 - 仅在未处理状态时显示 -->
          <view v-if="alarmDetail.status === AlarmStatus.UNPROCESSED" class="function-buttons">
            <view class="grid grid-cols-2 gap-24rpx">
              <!-- 标记为已处理按钮 -->
              <view
                class="function-btn rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
                :class="{ 'opacity-50': updatingStatus }" @click="updateStatus(AlarmStatus.PROCESSED)"
              >
                <view class="flex flex-col items-center">
                  <view
                    class="function-icon mb-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-20rpx bg-green-50"
                  >
                    <view
                      v-if="updatingStatus"
                      class="i-carbon-circle-dash h-48rpx w-48rpx animate-spin text-green-500"
                    />
                    <view v-else class="i-carbon-checkmark h-48rpx w-48rpx text-green-500" />
                  </view>
                  <text class="function-text text-24rpx text-gray-800 font-medium">
                    标记已处理
                  </text>
                </view>
              </view>

              <!-- 标记为误报按钮 -->
              <view
                class="function-btn rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg transition-all duration-300"
                :class="{ 'opacity-50': updatingStatus }" @click="updateStatus(AlarmStatus.FALSE_ALARM)"
              >
                <view class="flex flex-col items-center">
                  <view
                    class="function-icon mb-16rpx h-80rpx w-80rpx flex items-center justify-center rounded-20rpx bg-red-50"
                  >
                    <view v-if="updatingStatus" class="i-carbon-circle-dash h-48rpx w-48rpx animate-spin text-red-500" />
                    <view v-else class="i-carbon-close h-48rpx w-48rpx text-red-500" />
                  </view>
                  <text class="function-text text-24rpx text-gray-800 font-medium">
                    标记误报
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.alarm-detail-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

.navbar-custom {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);

  .back-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 88rpx;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.6;
      transform: scale(0.95);
    }
  }
}

.main-content {
  flex: 1;
  overflow: hidden;
}

.content-wrapper {
  padding: 32rpx;
}

.alarm-media-section {
  .media-controls {
    .mode-switch {
      .switch-container {
        display: inline-block;

        .switch-track {
          position: relative;
          width: 240rpx;
          height: 60rpx;

          .switch-slider {
            top: 0;
            left: 0;
            z-index: 1;
          }

          .switch-option {
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;

            &:active {
              transform: scale(0.98);
            }
          }
        }
      }
    }

    .thumbnail-panel {
      .thumbnail-container,
      .video-info {
        width: 250rpx;
        height: 100rpx;
        padding: 0 12rpx;
        border-radius: 16rpx;
        background: white;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      }

      .thumbnail-container {
        overflow: hidden;

        .thumbnail-list {
          display: flex;
          align-items: center;
          height: 100%;
          overflow-x: auto;

          // 隐藏滚动条
          &::-webkit-scrollbar {
            display: none;
          }
        }

        .thumbnail-item {
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2rpx solid transparent;
          border-radius: 8rpx;
          margin: 4rpx; // 为放大效果预留空间

          &.active {
            border-color: #3b82f6;
            transform: scale(1.05); // 恢复放大效果
          }

          &:active {
            transform: scale(0.95);
          }

          .thumbnail-image {
            // SmartImage 组件会处理自己的尺寸和样式
            display: block;
          }
        }
      }

      .video-info {
        display: flex;
        align-items: center;
        justify-content: center;

        .video-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .video-icon {
            width: 32rpx;
            height: 32rpx;
            color: #3b82f6;
            margin-bottom: 8rpx;
          }

          .video-text {
            font-size: 20rpx;
            color: #6b7280;
          }
        }
      }
    }
  }

  .media-container {
    position: relative;
    transition: all 0.3s ease;

    .media-content {
      .main-media-container {
        transition: all 0.3s ease;

        .alarm-image {
          // SmartImage 组件会处理自己的样式和交互
        }

        .video-player-container {
          position: relative;
          background: #000;

          .alarm-video {
            display: block;
          }
        }

        .no-video {
          display: flex;
        }
      }
    }
  }
}

/* 告警详情信息卡片样式 */
.alarm-info-card {
  position: relative;
  overflow: hidden;

  .card-gradient {
    position: absolute;
  }

  .card-header {
    .alarm-basic-info {
      .alarm-title {
        line-height: 1.3;
        word-break: break-all;
      }

      .alarm-id {
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      }
    }

    .status-indicator {
      .status-dot {
        box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
      }
    }
  }

  .alarm-info {
    position: relative;
    z-index: 10;

    .info-items {
      .info-item {
        border-bottom: 1rpx solid rgba(229, 231, 235, 0.5);

        &:last-child {
          border-bottom: none;
        }

        .item-label {
          opacity: 0.8;
        }

        .item-value {
          line-height: 1.5;
          word-break: break-all;
          text-align: right;

          &.font-mono {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          }
        }
      }
    }

    .notice-users {
      .user-tag {
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.95);
          background: #dbeafe;
        }
      }
    }
  }
}

/* 保留原有的info-card样式以防其他地方使用 */
.info-card {
  .card-header {
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
      background: #f3f4f6;
      transition: all 0.3s ease;

      &:active {
        background: #e5e7eb;
        transform: scale(0.95);
      }

      &.loading {
        background: #eff6ff;
      }
    }
  }

  .info-items {
    .info-item {
      .item-label {
        opacity: 0.8;
      }

      .item-value {
        line-height: 1.5;
        word-break: break-all;
      }
    }
  }

  .notice-users {
    .user-tag {
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        background: #dbeafe;
      }
    }
  }
}

/* 功能按钮样式 */
.function-buttons {
  .function-btn {
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      box-shadow:
        inset 4rpx 4rpx 8rpx rgba(163, 177, 198, 0.3),
        inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
    }
  }

  .function-icon {
    transition: all 0.3s ease;
  }
}
</style>
