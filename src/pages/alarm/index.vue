<route lang="jsonc" type="page">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "告警"
  }
}
</route>

<script lang="ts" setup>
import type { AlarmStatus, IAlarmListItem } from '@/api/alarm'
import { getAlarmList } from '@/api/alarm'

import AlarmList from './components/AlarmList.vue'
import AlarmSearchFilter from './components/AlarmSearchFilter.vue'

defineOptions({
  name: 'AlarmManagement',
})

const alarmList = ref<IAlarmListItem[]>([])
const searchKeyword = ref('')
const selectedStatus = ref<AlarmStatus | undefined>(undefined)
const selectedAlarmType = ref('')
const loading = ref(false)
const paging = ref()

// 处理搜索条件变化
function handleSearchChange(keyword: string) {
  searchKeyword.value = keyword
  loadAlarmList()
}

// 处理告警类型筛选变化
function handleAlarmTypeChange(alarmType: string) {
  selectedAlarmType.value = alarmType
  loadAlarmList()
}

// 加载告警列表
async function loadAlarmList(pageNo: number = 1, pageSize: number = 10) {
  const params = {
    page: pageNo,
    pageSize,
    deviceName: searchKeyword.value || undefined,
    status: selectedStatus.value,
    alarm_type_name: selectedAlarmType.value || undefined,
  }
  try {
    loading.value = true
    const response = await getAlarmList(params)
    paging.value?.complete(response.list)
  }
  catch (error) {
    console.error('加载告警列表失败:', error)
    paging.value?.complete([])
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="alarm-management-page bg-gray-50">
    <sar-navbar title="告警管理" class="navbar-custom" />
    <view class="main-content">
      <z-paging ref="paging" v-model="alarmList" :fixed="false" @query="loadAlarmList">
        <view class="content-wrapper">
          <view class="mb-32rpx">
            <AlarmSearchFilter @search-change="handleSearchChange" @alarm-type-change="handleAlarmTypeChange" />
          </view>

          <view class="alarm-list-container">
            <AlarmList :alarm-list="alarmList" :loading="loading" />
          </view>
        </view>
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.alarm-management-page {
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
  overflow: hidden;
}

.content-wrapper {
  padding: 32rpx;
}

.alarm-list-container {
  width: 100%;
}
</style>
