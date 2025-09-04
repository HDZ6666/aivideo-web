<!-- 告警搜索筛选组件 -->
<script setup lang="ts">
import { getAlarmCategory } from '@/api/alarm'

interface AlarmTypeOption {
  label: string
  value: string
}

interface Emits {
  (e: 'search-change', keyword: string): void
  (e: 'alarm-type-change', alarmType: string): void
}

const emit = defineEmits<Emits>()

// 告警类型选项
const alarmTypeOptions = ref<AlarmTypeOption[]>([
  { label: '全部类型', value: '' },
])

// 加载告警类型选项
async function loadAlarmTypeOptions() {
  try {
    // 尝试调用真实 API
    const response = await getAlarmCategory({ page: 1, pageSize: 100 })
    const options = response.list
      .map(item => ({
        label: item.alarmTypeName,
        value: item.alarmTypeName,
      }))

    alarmTypeOptions.value = [
      { label: '全部类型', value: '' },
      ...options,
    ]
  }
  catch (error) {
    console.error('加载告警类型选项失败:', error)
    // 保持默认选项
  }
}

const typePickerVisible = ref(false)
const typePickerValue = ref<string>('')
const typePickerLabel = ref<string>('全部类型')

// 搜索相关
const searchKeyword = ref('')
let debounceTimer: NodeJS.Timeout | null = null

function showTypePicker() {
  typePickerVisible.value = true
}

function handleTypePickerChange(value: string) {
  // 更新选择器状态
  const option = alarmTypeOptions.value.find(opt => opt.value === value)
  if (option) {
    typePickerLabel.value = option.label
  }

  // 触发告警类型变更事件
  emit('alarm-type-change', value)
}

function handleSearchInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('search-change', searchKeyword.value.trim())
  }, 300)
}

function clearSearch() {
  searchKeyword.value = ''

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  emit('search-change', '')
}

defineExpose({
  clearSearch,
  getSearchKeyword: () => searchKeyword.value,
})

// 组件挂载时加载告警类型选项
onMounted(() => {
  loadAlarmTypeOptions()
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <view class="alarm-search-filter">
    <view class="search-filter-container rounded-24rpx bg-white p-24rpx shadow-gray-200/60 shadow-lg">
      <view class="flex items-center gap-24rpx">
        <view class="search-section flex-1">
          <view
            class="search-input-wrapper flex items-center rounded-16rpx bg-gray-50 px-24rpx py-16rpx shadow-gray-300/50 shadow-inner"
          >
            <view class="i-carbon-search mr-16rpx h-32rpx w-32rpx text-gray-400" />
            <input
              v-model="searchKeyword"
              placeholder="搜索设备名称..."
              class="flex-1 bg-transparent text-gray-700 placeholder-gray-400"
              @input="handleSearchInput"
            >
            <view
              v-if="searchKeyword"
              class="i-carbon-close ml-16rpx h-32rpx w-32rpx text-gray-400"
              @click="clearSearch"
            />
          </view>
        </view>

        <view class="alarm-type-section">
          <view class="alarm-type-trigger flex cursor-pointer items-center" @click="showTypePicker">
            <text class="mr-8rpx text-28rpx text-gray-800 font-medium">
              {{ typePickerLabel }}
            </text>
            <view
              class="i-carbon-chevron-down h-24rpx w-24rpx text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': typePickerVisible }"
            />
          </view>

          <sar-picker-popout
            v-model="typePickerValue"
            v-model:visible="typePickerVisible"
            title="选择告警类型"
            :columns="alarmTypeOptions"
            @change="handleTypePickerChange"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.alarm-search-filter {
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

.alarm-type-section {
  .alarm-type-trigger {
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
