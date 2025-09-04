<script setup lang="ts">
import type { IAlarmListItem } from '@/api/alarm'
import { AlarmStatus } from '@/api/alarm'
import { LoadingState } from '@/components/loading-state'
import { SmartImage } from '@/components/smart-image'
import { useAlarmStore } from '@/store/alarm'
import { formatTime } from '@/utils'

interface Props {
  alarmList: IAlarmListItem[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const alarmStore = useAlarmStore()

function getStatusInfo(status: AlarmStatus) {
  switch (status) {
    case AlarmStatus.UNPROCESSED:
      return { text: '待处理', theme: 'primary' as const }
    case AlarmStatus.PROCESSED:
      return { text: '已处理', theme: 'success' as const }
    case AlarmStatus.FALSE_ALARM:
      return { text: '误报', theme: 'danger' as const }
    default:
      return { text: '未知', theme: 'secondary' as const }
  }
}

function handleAlarmClick(alarm: IAlarmListItem) {
  alarmStore.setSelectedAlarm(alarm)

  uni.navigateTo({
    url: `/pages/alarm/detail?id=${alarm.id}`,
  })
}
</script>

<template>
  <view class="alarm-list">
    <LoadingState
      v-if="loading && alarmList.length === 0"
      state="loading"
      loading-text="正在加载告警数据..."
    />

    <view v-else class="alarm-items">
      <view
        v-for="alarm in alarmList" :key="alarm.id"
        class="alarm-item mb-24rpx overflow-hidden rounded-24rpx bg-white shadow-gray-200/60 shadow-lg"
        @click="handleAlarmClick(alarm)"
      >
        <view class="alarm-image-container relative">
          <SmartImage
            :src="alarm.alarmImg"
            class="alarm-image"
            height="300rpx"
            width="100%"
            mode="aspectFill"
            border-radius="0"
            :icon-size="128"
            :text-size="28"
            :show-state-text="true"
            :enable-preview="false"
          />

          <view class="status-badge absolute right-16rpx top-16rpx">
            <sar-tag :theme="getStatusInfo(alarm.status).theme">
              {{ getStatusInfo(alarm.status).text }}
            </sar-tag>
          </view>
        </view>

        <view class="alarm-info p-32rpx">
          <view class="device-name mb-12rpx">
            <text class="text-32rpx text-gray-800 font-semibold">
              {{ alarm.deviceName || '未知设备' }}
            </text>
          </view>

          <view class="alarm-bottom-info flex items-center justify-between">
            <view class="alarm-type-info">
              <view class="inline-flex items-center gap-8rpx rounded-12rpx bg-gray-500 px-16rpx py-8rpx text-24rpx text-white font-bold">
                <view class="i-carbon-unknown h-20rpx w-20rpx" />
                <text>{{ alarm.modelname || '未知类型' }}</text>
              </view>
            </view>

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
</style>
