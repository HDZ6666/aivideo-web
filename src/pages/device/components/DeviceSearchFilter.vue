<script setup lang="ts">
import { DeviceType, useDeviceStore } from '@/store/device'

interface DeviceTypeOption {
  label: string
  value: DeviceType
}

interface Emits {
  (e: 'deviceTypeChange', deviceType: DeviceType): void
  (e: 'searchChange', keyword: string): void
}

const emit = defineEmits<Emits>()

const deviceStore = useDeviceStore()

// 设备类型选项
const deviceTypeOptions: DeviceTypeOption[] = [
  {
    label: '国标',
    value: DeviceType.NATIONAL,
  },
  {
    label: '拉流',
    value: DeviceType.PROXY,
  },
]

const typePickerVisible = ref(false)
const typePickerValue = ref<string>('')
const typePickerLabel = ref<string>('')

// 搜索相关
const searchKeyword = ref('')
const searchPlaceholder = ref('')
let debounceTimer: NodeJS.Timeout | null = null

onMounted(() => {
  initializeComponent()
})

// ===== 初始化相关函数 =====

/**
 * 初始化组件
 */
function initializeComponent() {
  const currentDeviceType = deviceStore.selectedDeviceType
  searchPlaceholder.value = currentDeviceType === DeviceType.NATIONAL
    ? '搜索国标设备名称'
    : '搜索拉流代理设备名称'

  // 初始化设备类型选择器状态
  const currentOption = deviceTypeOptions.find(option => option.value === currentDeviceType)
  if (currentOption) {
    typePickerValue.value = currentOption.value
    typePickerLabel.value = currentOption.label
  }
}

function showTypePicker() {
  typePickerVisible.value = true
}

function handleTypePickerChange(value: DeviceType) {
  if (deviceStore.selectedDeviceType === value) {
    return
  }

  // 更新选择器状态
  const option = deviceTypeOptions.find(opt => opt.value === value)
  if (option) {
    typePickerLabel.value = option.label
  }

  // 清空搜索关键词
  searchKeyword.value = ''

  // 触发设备类型变更事件
  emit('deviceTypeChange', value)
}

function handleSearchInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('searchChange', searchKeyword.value.trim())
  }, 300)
}

function clearSearch() {
  searchKeyword.value = ''

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  emit('searchChange', '')
}

defineExpose({
  clearSearch,
  getSearchKeyword: () => searchKeyword.value,
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <view class="device-search-filter">
    <view class="search-filter-container rounded-24rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
      <view class="flex items-center gap-24rpx">
        <view class="search-section flex-1">
          <view
            class="search-input-wrapper flex items-center rounded-16rpx bg-gray-50 px-24rpx py-16rpx shadow-gray-300/50 shadow-inner"
          >
            <view class="i-carbon-search mr-16rpx h-32rpx w-32rpx text-gray-400" />
            <input
              v-model="searchKeyword" :placeholder="searchPlaceholder"
              class="flex-1 bg-transparent text-gray-700 placeholder-gray-400" @input="handleSearchInput"
            >
            <view
              v-if="searchKeyword" class="i-carbon-close ml-16rpx h-32rpx w-32rpx text-gray-400"
              @click="clearSearch"
            />
          </view>
        </view>

        <view class="device-type-section">
          <view class="device-type-trigger flex cursor-pointer items-center" @click="showTypePicker">
            <text class="mr-8rpx text-28rpx text-gray-800 font-medium">
              {{ typePickerLabel }}
            </text>
            <view
              class="i-carbon-chevron-down h-24rpx w-24rpx text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': typePickerVisible }"
            />
          </view>

          <sar-picker-popout
            v-model="typePickerValue" v-model:visible="typePickerVisible" title="选择设备类型"
            :columns="deviceTypeOptions" @change="handleTypePickerChange"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.device-search-filter {
  width: 100%;
}

.search-filter-container {
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      8rpx 8rpx 16rpx rgba(163, 177, 198, 0.4),
      -8rpx -8rpx 16rpx rgba(255, 255, 255, 0.8);
  }
}

.search-section {
  .search-input-wrapper {
    transition: all 0.3s ease;

    &:focus-within {
      box-shadow:
        inset 4rpx 4rpx 8rpx rgba(163, 177, 198, 0.3),
        inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
    }
  }

  input {
    outline: none;
    border: none;
    font-size: 28rpx;
    line-height: 1.5;

    &::placeholder {
      color: #9ca3af;
    }
  }

  .i-carbon-close {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #ef4444;
      transform: scale(1.1);
    }
  }
}

.device-type-section {
  .device-type-trigger {
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }

  .i-carbon-chevron-down {
    transition: transform 0.2s ease;

    &.rotate-180 {
      transform: rotate(180deg);
    }
  }
}
</style>
