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

/**
 * 检测告警数据是否已经更新（过时）
 * @param newFirstId 新页面第一条告警的ID
 * @returns 是否需要刷新数据
 */
function checkAlarmDataOutdated(newFirstId: number): boolean {
  // 情况1：检查是否有重复数据（从后往前查找，因为重复数据通常在后面）
  for (let i = alarmList.value.length - 1; i >= 0; i--) {
    if (alarmList.value[i].id === newFirstId) {
      return true // 发现重复，说明数据已过时
    }
  }

  // 情况2：如果没有重复，但新页面第一条ID大于当前列表第一条ID
  // 说明有新数据插入，整页都可能过时了
  if (alarmList.value.length > 0 && newFirstId > alarmList.value[0].id) {
    return true // 整页数据过时
  }

  return false
}

// 处理搜索条件变化
function handleSearchChange(keyword: string) {
  searchKeyword.value = keyword
  paging.value?.reload()
}

// 处理告警类型筛选变化
function handleAlarmTypeChange(alarmType: string) {
  selectedAlarmType.value = alarmType
  paging.value?.reload()
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

    // 判断拿到的列表是否已经更新了
    if (pageNo > 1 && response.list.length > 0) {
      const firstId = response.list[0].id

      if (checkAlarmDataOutdated(firstId)) {
        console.log('数据已经不是最新的了，触发刷新', alarmList.value)
        paging.value?.refresh()
        return
      }
    }
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

function handleListChange(list: IAlarmListItem[]) {
  console.log('listChange', list)
}

onShow(() => {
  paging.value?.refresh()
})
</script>

<template>
  <view class="alarm-management-page bg-gray-50">
    <sar-navbar title="告警管理" class="navbar-custom" />
    <view class="main-content">
      <z-paging
        ref="paging" v-model="alarmList" :fixed="false" auto-show-back-to-top @query="loadAlarmList"
        @list-change="handleListChange"
      >
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
