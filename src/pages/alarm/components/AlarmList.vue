<!-- 告警列表组件 -->
<script setup lang="ts">
import type { IAlarmListItem } from '@/api/alarm'
import { AlarmStatus } from '@/api/alarm'
import { LoadingState } from '@/components/loading-state'
import { useAlarmStore } from '@/store/alarm'

interface Props {
  alarmList: IAlarmListItem[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

// 使用告警状态管理
const alarmStore = useAlarmStore()

// 获取状态显示信息 - 使用 sar-tag 组件
function getStatusInfo(status: AlarmStatus) {
  switch (status) {
    case AlarmStatus.UNPROCESSED:
      return { text: '待处理', theme: 'primary' as const }
    case AlarmStatus.PROCESSED:
      return { text: '已处理', theme: 'success' as const }
    case AlarmStatus.FALSE_ALARM:
      return { text: '误报', theme: 'danger' as const }
    default:
      return { text: '未知', theme: 'default' as const }
  }
}

// 获取告警类型颜色和图标 - 基于告警类型进行主题化
function getAlarmTypeInfo(modelname?: string) {
  const typeName = modelname || '未知类型'

  // 根据告警类型返回不同的主题色和图标
  switch (typeName) {
    case '人员入侵检测':
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        icon: 'i-carbon-user-identification',
        theme: 'danger' as const,
      }
    case '区域入侵检测':
      return {
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        icon: 'i-carbon-area',
        theme: 'warning' as const,
      }
    case '人员聚集检测':
      return {
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
        icon: 'i-carbon-group',
        theme: 'warning' as const,
      }
    case '物品遗留检测':
      return {
        bgColor: 'bg-purple-500',
        textColor: 'text-white',
        icon: 'i-carbon-package',
        theme: 'secondary' as const,
      }
    case '烟火检测':
      return {
        bgColor: 'bg-red-600',
        textColor: 'text-white',
        icon: 'i-carbon-fire',
        theme: 'danger' as const,
      }
    case '面部遮挡检测':
      return {
        bgColor: 'bg-indigo-500',
        textColor: 'text-white',
        icon: 'i-carbon-face-mask',
        theme: 'info' as const,
      }
    case '未佩戴安全帽':
      return {
        bgColor: 'bg-amber-500',
        textColor: 'text-white',
        icon: 'i-carbon-construction',
        theme: 'warning' as const,
      }
    case '垃圾桶满溢':
      return {
        bgColor: 'bg-green-600',
        textColor: 'text-white',
        icon: 'i-carbon-trash-can',
        theme: 'success' as const,
      }
    default:
      return {
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
        icon: 'i-carbon-unknown',
        theme: 'default' as const,
      }
  }
}

// 格式化时间
function formatTime(timeStr: string) {
  try {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // 小于1分钟
    if (diff < 60 * 1000) {
      return '刚刚'
    }

    // 小于1小时
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}分钟前`
    }

    // 小于1天
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours}小时前`
    }

    // 超过1天，显示具体日期
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  catch (error) {
    return timeStr
  }
}

// 处理告警项点击 - 设置选中状态并跳转到详情页面
function handleAlarmClick(alarm: IAlarmListItem) {
  // 设置选中的告警到store
  alarmStore.setSelectedAlarm(alarm)

  // 跳转到详情页
  uni.navigateTo({
    url: `/pages/alarm/detail?id=${alarm.id}`,
  })
}
</script>

<template>
  <view class="alarm-list">
    <!-- 加载状态 -->
    <LoadingState
      v-if="loading && alarmList.length === 0"
      state="loading"
      loading-text="正在加载告警数据..."
      compact
    />

    <!-- 空状态 -->
    <LoadingState
      v-else-if="!loading && alarmList.length === 0"
      state="empty"
      empty-text="暂无告警数据"
      empty-description="当前没有符合条件的告警信息"
      :show-retry="false"
      compact
    />

    <!-- 告警列表 -->
    <view v-else class="alarm-items">
      <view
        v-for="alarm in alarmList" :key="alarm.id"
        class="alarm-item mb-24rpx overflow-hidden rounded-24rpx bg-white shadow-gray-200/60 shadow-lg"
        @click="handleAlarmClick(alarm)"
      >
        <!-- 告警图片 -->
        <view class="alarm-image-container relative">
          <image
            :src="alarm.alarmImg || `https://picsum.photos/400/200?random=${alarm.id}`"
            class="alarm-image h-300rpx w-full object-cover" mode="aspectFill" lazy-load
          />

          <!-- 状态标签 - 使用 sar-tag 组件 -->
          <view class="status-badge absolute right-16rpx top-16rpx">
            <sar-tag :theme="getStatusInfo(alarm.status).theme">
              {{ getStatusInfo(alarm.status).text }}
            </sar-tag>
          </view>
        </view>

        <!-- 告警信息 -->
        <view class="alarm-info p-32rpx">
          <!-- 设备名称 -->
          <view class="device-name mb-12rpx">
            <text class="text-32rpx text-gray-800 font-semibold">
              {{ alarm.deviceName || '未知设备' }}
            </text>
          </view>

          <!-- 底部信息：告警类型和时间 -->
          <view class="alarm-bottom-info flex items-center justify-between">
            <!-- 左侧：告警类型 - 方案一：带图标的彩色标签 -->
            <view class="alarm-type-info">
              <view
                class="inline-flex items-center gap-8rpx rounded-12rpx px-16rpx py-8rpx text-24rpx font-bold"
                :class="[getAlarmTypeInfo(alarm.modelname).bgColor, getAlarmTypeInfo(alarm.modelname).textColor]"
              >
                <view
                  class="h-20rpx w-20rpx"
                  :class="getAlarmTypeInfo(alarm.modelname).icon"
                />
                <text>{{ alarm.modelname || '未知类型' }}</text>
              </view>
            </view>

            <!-- 右侧：时间 -->
            <view class="time-info">
              <text class="text-24rpx text-gray-500">
                {{ formatTime(alarm.alarmTime) }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.alarm-list {
  width: 100%;
}

.alarm-items {
  .alarm-item {
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;

    &:active {
      transform: scale(0.98);
    }

    .alarm-image-container {
      position: relative;

      .alarm-image {
        transition: all 0.3s ease;
      }

      .status-badge {
        .status-tag {
          backdrop-filter: blur(8rpx);
          transition: all 0.3s ease;
        }
      }

      .alarm-type-badge {
        .type-tag {
          backdrop-filter: blur(8rpx);
          transition: all 0.3s ease;
        }
      }
    }

    .alarm-info {
      .device-name {
        text {
          line-height: 1.4;
        }
      }

      .alarm-bottom-info {
        .alarm-type-info {
          flex: 1;
        }

        .time-info {
          text {
            line-height: 1.4;
          }
        }
      }
    }

    // 悬停效果（仅在支持的设备上）
    @media (hover: hover) {
      &:hover {
        transform: translateY(-4rpx);
        box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.15);

        .alarm-image {
          transform: scale(1.02);
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 750rpx) {
  .alarm-items {
    .alarm-item {
      .alarm-image-container {
        .alarm-image {
          height: 240rpx;
        }

        .status-badge {
          top: 12rpx;
          right: 12rpx;

          .status-tag {
            padding: 6rpx 12rpx;

            text {
              font-size: 20rpx;
            }
          }
        }

        .alarm-type-badge {
          bottom: 12rpx;
          left: 12rpx;

          .type-tag {
            padding: 8rpx 16rpx;

            text {
              font-size: 22rpx;
            }
          }
        }
      }

      .alarm-info {
        padding: 24rpx;

        .device-name {
          margin-bottom: 12rpx;

          text {
            font-size: 28rpx;
          }
        }

        .alarm-bottom-info {
          .alarm-type-info {
            text {
              font-size: 22rpx;
            }
          }

          .time-info {
            text {
              font-size: 22rpx;
            }
          }
        }
      }
    }
  }
}
</style>
