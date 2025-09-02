<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="jsonc" type="home">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页"
  }
}
</route>

<script lang="ts" setup>
import type { IAlarmStatItem, IDeviceResourceInfo } from '@/api/home'
import { computed, onMounted, ref } from 'vue'
import { getDeviceResourceInfo, getScreenAlarmStatistics } from '@/api/home'
import { LoadingState } from '@/components/loading-state'

import AlarmStatsCard from './components/AlarmStatsCard.vue'
import StatsCard from './components/StatsCard.vue'

defineOptions({
  name: 'Home',
})

// z-paging 引用
const paging = ref()

// 数据状态
const deviceResourceData = ref<IDeviceResourceInfo | null>(null)
const alarmData = ref<IAlarmStatItem[] | null>(null)
const loading = ref(false)
const hasError = ref(false)

// 请求设备资源统计数据
async function fetchDeviceData() {
  try {
    const result = await getDeviceResourceInfo()
    deviceResourceData.value = result
  }
  catch (error) {
    console.error('获取设备数据失败:', error)
    deviceResourceData.value = null
  }
}

// 请求告警统计数据
async function fetchAlarmData() {
  try {
    const result = await getScreenAlarmStatistics()
    alarmData.value = result
  }
  catch (error) {
    console.error('获取告警数据失败:', error)
    alarmData.value = null
  }
}

// 初始化数据
async function initData() {
  loading.value = true
  hasError.value = false
  try {
    await Promise.all([
      fetchDeviceData(),
      fetchAlarmData(),
    ])
  }
  catch (error) {
    console.error('初始化数据失败:', error)
    hasError.value = true
  }
  finally {
    loading.value = false
  }
}

// 计算设备统计数据
const deviceStats = computed(() => {
  if (deviceResourceData.value) {
    // 使用真实接口数据
    return {
      nationalDevices: deviceResourceData.value.device.total, // 国标设备总数
      totalChannels: deviceResourceData.value.channel.total, // 通道总数量
      onlineChannels: deviceResourceData.value.channel.online, // 在线通道数
      proxyDevices: deviceResourceData.value.proxy.total, // 非国标设备数
    }
  }
  else {
    // 接口失败时返回空数据
    return {
      nationalDevices: 0,
      onlineChannels: 0,
      proxyDevices: 0,
    }
  }
})

// 计算告警统计数据
const alarmStats = computed(() => {
  if (alarmData.value && alarmData.value.length > 0) {
    // 使用真实接口数据，汇总所有告警类型的统计
    const totalStats = alarmData.value.reduce((acc, item) => {
      acc.todayAlarms += item.curDateAlarmCount
      acc.todayUnprocessed += item.curDateAlarmNoHandleCount
      acc.last7DaysAlarms += item.sevenDayAlarmCount
      acc.last7DaysUnprocessed += item.sevenDayAlarmNoHandleCount
      return acc
    }, {
      todayAlarms: 0,
      todayUnprocessed: 0,
      last7DaysAlarms: 0,
      last7DaysUnprocessed: 0,
    })

    return totalStats
  }
  else {
    // 接口失败时返回空数据
    return []
  }
})

// 下拉刷新
async function onRefresh() {
  try {
    console.log('下拉刷新')
    // 重新请求两个接口
    await Promise.all([
      fetchDeviceData(),
      fetchAlarmData(),
    ])
  }
  catch (error) {
    console.error('刷新失败:', error)
  }
  finally {
    paging.value?.complete()
  }
}

// 页面挂载时初始化数据
onMounted(() => {
  initData()
})
</script>

<template>
  <view class="home-page bg-gray-50">
    <sar-navbar title="工作台" class="navbar-custom" />
    <view class="main-content">
      <!-- 加载状态 -->
      <LoadingState
        v-if="loading"
        state="loading"
        loading-text="正在加载数据..."
      />

      <!-- 错误状态 -->
      <LoadingState
        v-else-if="hasError"
        state="error"
        error-text="数据加载失败"
        @retry="initData"
      />

      <!-- 正常内容 -->
      <z-paging v-else ref="paging" :fixed="false" refresher-only @on-refresh="onRefresh">
        <view class="content-wrapper">
          <!-- 设备统计卡片 -->
          <view class="section-header">
            <view class="section-title">
              <view class="i-carbon-devices section-icon" />
              <text>设备统计</text>
            </view>
          </view>

          <!-- 设备统计 -->
          <view class="mb-32rpx">
            <StatsCard :stats="deviceStats" />
          </view>

          <!-- 告警统计卡片 -->
          <view class="section-header">
            <view class="section-title">
              <view class="section-icon i-carbon-warning" />
              <text>告警统计</text>
            </view>
          </view>

          <view class="mb-32rpx">
            <AlarmStatsCard :stats="alarmStats" />
          </view>
        </view>
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  height: 100vh;
  overflow: hidden;
  padding-bottom: 100rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.navbar-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  flex: 1;
  overflow: auto;
}

.content-wrapper {
  padding: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .section-title {
    display: flex;
    align-items: center;
    color: #333;
    font-size: 32rpx;
    font-weight: 600;

    .section-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 16rpx;
      color: #667eea;
    }
  }

  .section-actions {
    display: flex;
    gap: 16rpx;
  }
}

.quick-actions {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

  .action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32rpx;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx;
    border-radius: 12rpx;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      background-color: #f8f9fa;
    }

    .action-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;

      view {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .action-label {
      color: #333;
      font-size: 28rpx;
      text-align: center;
    }
  }
}

.stats-title {
  color: #666;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}
</style>
