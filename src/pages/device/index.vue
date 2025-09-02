<route lang="jsonc" type="page">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "设备"
  }
}
</route>

<script lang="ts" setup>
import type { INationalDevice, IProxyDevice } from '@/api/device'
import { getNationalDevices, getProxyDevices } from '@/api/device'

import { DeviceType, useDeviceStore } from '@/store/device'
import DeviceSearchFilter from './components/DeviceSearchFilter.vue'
import NationalDeviceList from './components/NationalDeviceList.vue'
import StreamProxyList from './components/StreamProxyList.vue'

defineOptions({
  name: 'DeviceManagement',
})

const deviceStore = useDeviceStore()
const nationalDeviceList = ref<INationalDevice[]>([])
const proxyDeviceList = ref<IProxyDevice[]>([])
const searchKeyword = ref('')
const loading = ref(false)
const paging = ref()

function handleDeviceTypeChange(deviceType: DeviceType) {
  deviceStore.setDeviceType(deviceType)
  searchKeyword.value = ''
  loadDeviceData()
}

function handleSearchChange(keyword: string) {
  searchKeyword.value = keyword
  loadDeviceData()
}

async function loadDeviceData() {
  try {
    loading.value = true
    if (deviceStore.selectedDeviceType === DeviceType.NATIONAL) {
      await loadNationalDevices()
    }
    else {
      await loadProxyDevices()
    }
  }
  catch (error) {
    console.error('加载设备数据失败:', error)
  }
  finally {
    loading.value = false
  }
}

async function loadNationalDevices() {
  try {
    const response = await getNationalDevices(1, 50, searchKeyword.value)
    nationalDeviceList.value = response.list
  }
  catch (error) {
    console.error('加载国标设备失败:', error)
  }
}

async function loadProxyDevices() {
  try {
    const response = await getProxyDevices(1, 50, searchKeyword.value)
    proxyDeviceList.value = response.list
  }
  catch (error) {
    console.error('加载代理设备失败:', error)
  }
}

async function onRefresh() {
  try {
    await loadDeviceData()
  }
  catch (error) {
    console.error('刷新失败:', error)
  }
  finally {
    paging.value?.complete()
  }
}

onMounted(() => {
  loadDeviceData()
})
</script>

<template>
  <view class="device-management-page bg-gray-50">
    <sar-navbar title="设备管理" class="navbar-custom" />
    <view class="main-content">
      <z-paging ref="paging" :fixed="false" refresher-only @on-refresh="onRefresh">
        <view class="content-wrapper">
          <view class="mb-32rpx">
            <DeviceSearchFilter
              @device-type-change="handleDeviceTypeChange" @search-change="handleSearchChange"
            />
          </view>

          <view class="device-list-container">
            <NationalDeviceList
              v-if="deviceStore.selectedDeviceType === DeviceType.NATIONAL"
              :device-list="nationalDeviceList" :loading="loading"
            />

            <StreamProxyList
              v-else :device-list="proxyDeviceList" :loading="loading"
            />
          </view>
        </view>
      </z-paging>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.device-management-page {
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

.device-list-container {
  width: 100%;
}
</style>
