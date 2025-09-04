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
import { getNationalDevices, getProxyDevices } from '@/api/device'

import { DeviceType, useDeviceStore } from '@/store/device'
import DeviceSearchFilter from './components/DeviceSearchFilter.vue'
import NationalDeviceList from './components/NationalDeviceList.vue'
import StreamProxyList from './components/StreamProxyList.vue'

defineOptions({
  name: 'DeviceManagement',
})

const deviceStore = useDeviceStore()
// const nationalDeviceList = ref<INationalDevice[]>([])
// const proxyDeviceList = ref<IProxyDevice[]>([])
const searchKeyword = ref('')
const loading = ref(false)
const paging = ref()
const currentDeviceList = ref([])

// 当前设备列表的计算属性
// const currentDeviceList = computed({
//   get: () => deviceStore.selectedDeviceType === DeviceType.NATIONAL ? nationalDeviceList.value : proxyDeviceList.value,
//   set: (value) => {
//     if (deviceStore.selectedDeviceType === DeviceType.NATIONAL) {
//       nationalDeviceList.value = value as INationalDevice[]
//     }
//     else {
//       proxyDeviceList.value = value as IProxyDevice[]
//     }
//   },
// })

// 处理设备类型变化
function handleDeviceTypeChange(deviceType: DeviceType) {
  deviceStore.setDeviceType(deviceType)
  searchKeyword.value = ''
  // 重新加载数据
  paging.value?.reload()
}

// 处理搜索条件变化
function handleSearchChange(keyword: string) {
  searchKeyword.value = keyword
  // 重新加载数据
  paging.value?.reload()
}

// 统一的设备数据加载函数
async function loadDeviceData(pageNo: number = 1, pageSize: number = 10) {
  try {
    loading.value = true

    if (deviceStore.selectedDeviceType === DeviceType.NATIONAL) {
      const response = await getNationalDevices(pageNo, pageSize, searchKeyword.value)
      // z-paging 会自动处理数据追加
      paging.value?.complete(response.list)
    }
    else {
      const response = await getProxyDevices(pageNo, pageSize, searchKeyword.value)
      // z-paging 会自动处理数据追加
      paging.value?.complete(response.list)
    }
  }
  catch (error) {
    console.error('加载设备数据失败:', error)
    paging.value?.complete([])
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="device-management-page bg-gray-50">
    <sar-navbar title="设备管理" class="navbar-custom" />
    <view class="main-content">
      <z-paging
        ref="paging"
        v-model="currentDeviceList"
        :fixed="false"
        auto-show-back-to-top
        @query="loadDeviceData"
      >
        <view class="content-wrapper">
          <view class="mb-32rpx">
            <DeviceSearchFilter
              @device-type-change="handleDeviceTypeChange" @search-change="handleSearchChange"
            />
          </view>

          <view class="device-list-container">
            <NationalDeviceList
              v-if="deviceStore.selectedDeviceType === DeviceType.NATIONAL"
              :device-list="currentDeviceList" :loading="loading"
            />

            <StreamProxyList
              v-else :device-list="currentDeviceList" :loading="loading"
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
