<!-- 告警搜索筛选组件 -->
<script setup lang="ts">
import { AlarmStatus, getAlarmCategory } from '@/api/alarm'

interface AlarmTypeOption {
  label: string
  value: string
}

interface AlarmFilterValue {
  deviceName: string
  alarm_type_name: string
  startTime: string
  endTime: string
  status: AlarmStatus | undefined
}

interface StatusOption {
  label: string
  value: AlarmStatus | ''
}

interface Emits {
  (e: 'search-change', keyword: string): void
  (e: 'filter-change', filters: AlarmFilterValue): void
}

const emit = defineEmits<Emits>()

const alarmTypeOptions = ref<AlarmTypeOption[]>([
  { label: '全部类型', value: '' },
])

const statusOptions: StatusOption[] = [
  { label: '全部状态', value: '' },
  { label: '误报', value: AlarmStatus.FALSE_ALARM },
  { label: '已处理', value: AlarmStatus.PROCESSED },
  { label: '未处理', value: AlarmStatus.UNPROCESSED },
]

function createEmptyFilters(): AlarmFilterValue {
  return {
    deviceName: '',
    alarm_type_name: '',
    startTime: '',
    endTime: '',
    status: undefined,
  }
}

const advancedVisible = ref(false)
const alarmTypePickerVisible = ref(false)
const statusPickerVisible = ref(false)
const startTimePickerVisible = ref(false)
const endTimePickerVisible = ref(false)

const searchKeyword = ref('')
const validationMessage = ref('')
const filterForm = reactive<AlarmFilterValue>(createEmptyFilters())
const appliedFilters = reactive<AlarmFilterValue>(createEmptyFilters())
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const activeFilterCount = computed(() => {
  return [
    appliedFilters.deviceName,
    appliedFilters.alarm_type_name,
    appliedFilters.startTime,
    appliedFilters.endTime,
    appliedFilters.status !== undefined ? String(appliedFilters.status) : '',
  ].filter(Boolean).length
})

const advancedTriggerText = computed(() => {
  return activeFilterCount.value > 0
    ? `高级检索(${activeFilterCount.value})`
    : '高级检索'
})

const filterAlarmTypeLabel = computed(() => {
  const option = alarmTypeOptions.value.find(item => item.value === filterForm.alarm_type_name)
  return option?.label || '全部类型'
})

const statusPickerValue = computed<AlarmStatus | ''>({
  get: () => filterForm.status ?? '',
  set: (value) => {
    filterForm.status = value === '' ? undefined : value
  },
})

const filterStatusLabel = computed(() => {
  const option = statusOptions.find(item => item.value === statusPickerValue.value)
  return option?.label || '全部状态'
})

async function loadAlarmTypeOptions() {
  try {
    const response = await getAlarmCategory({ page: 1, pageSize: 100 })
    const options = response.list.filter(item => item.isUse === 1).map(item => ({
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
  }
}

function normalizeFilters(filters: AlarmFilterValue): AlarmFilterValue {
  return {
    deviceName: filters.deviceName.trim(),
    alarm_type_name: filters.alarm_type_name,
    startTime: filters.startTime,
    endTime: filters.endTime,
    status: filters.status,
  }
}

function setFilters(target: AlarmFilterValue, source: AlarmFilterValue) {
  Object.assign(target, source)
}

function openAdvancedSearch() {
  validationMessage.value = ''
  setFilters(filterForm, {
    ...appliedFilters,
    deviceName: searchKeyword.value.trim(),
  })
  advancedVisible.value = true
}

function closeAdvancedSearch() {
  validationMessage.value = ''
  advancedVisible.value = false
}

function showAlarmTypePicker() {
  alarmTypePickerVisible.value = true
}

function handleAlarmTypeChange(value: string) {
  filterForm.alarm_type_name = value
}

function showStatusPicker() {
  statusPickerVisible.value = true
}

function handleStatusChange(value: AlarmStatus | '') {
  statusPickerValue.value = value
}

function handleSearchInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    const keyword = searchKeyword.value.trim()
    appliedFilters.deviceName = keyword
    filterForm.deviceName = keyword
    emit('search-change', keyword)
  }, 300)
}

function clearSearch() {
  searchKeyword.value = ''
  appliedFilters.deviceName = ''
  filterForm.deviceName = ''

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  emit('search-change', '')
}

function clearTimeField(field: 'startTime' | 'endTime') {
  validationMessage.value = ''
  filterForm[field] = ''
}

function applyAdvancedSearch() {
  const nextFilters = normalizeFilters(filterForm)

  if (nextFilters.startTime && nextFilters.endTime && nextFilters.startTime > nextFilters.endTime) {
    validationMessage.value = '开始时间不能晚于结束时间'
    return
  }

  validationMessage.value = ''
  setFilters(appliedFilters, nextFilters)
  searchKeyword.value = nextFilters.deviceName
  advancedVisible.value = false
  emit('filter-change', nextFilters)
}

function resetAdvancedSearch() {
  const emptyFilters = createEmptyFilters()
  setFilters(filterForm, emptyFilters)
  setFilters(appliedFilters, emptyFilters)
  searchKeyword.value = ''
  validationMessage.value = ''
  advancedVisible.value = false
  emit('filter-change', emptyFilters)
}

watch(
  () => [filterForm.startTime, filterForm.endTime],
  () => {
    validationMessage.value = ''
  },
)

defineExpose({
  clearSearch,
  getSearchKeyword: () => searchKeyword.value,
})

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
      <view class="flex items-center gap-20rpx">
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

        <view class="advanced-section">
          <view class="advanced-trigger flex cursor-pointer items-center" @click="openAdvancedSearch">
            <text class="mr-8rpx text-28rpx text-gray-800 font-medium">
              {{ advancedTriggerText }}
            </text>
            <view
              class="i-carbon-chevron-down h-24rpx w-24rpx text-gray-600 transition-transform duration-200"
              :class="{ 'rotate-180': advancedVisible }"
            />
          </view>
        </view>
      </view>
    </view>

    <sar-popup
      v-model:visible="advancedVisible"
      effect="slide-bottom"
      :overlay-closable="true"
    >
      <view class="advanced-popup">
        <view class="popup-header mb-28rpx flex items-center justify-between">
          <text class="popup-title text-34rpx text-gray-900 font-semibold">
            高级检索
          </text>
          <view class="close-btn" @click="closeAdvancedSearch">
            <view class="i-carbon-close h-30rpx w-30rpx text-gray-500" />
          </view>
        </view>

        <view v-if="validationMessage" class="validation-banner mb-24rpx">
          <view class="i-carbon-warning h-30rpx w-30rpx flex-shrink-0 text-red-500" />
          <text class="validation-text">
            {{ validationMessage }}
          </text>
        </view>

        <view class="filter-form">
          <view class="filter-field">
            <text class="field-label">
              设备名称
            </text>
            <view class="field-control">
              <view class="field-icon i-carbon-devices" />
              <input
                v-model="filterForm.deviceName"
                class="field-input"
                placeholder="请输入设备名称"
                placeholder-class="field-placeholder"
              >
              <view
                v-if="filterForm.deviceName"
                class="i-carbon-close clear-icon"
                @click="filterForm.deviceName = ''"
              />
            </view>
          </view>

          <view class="filter-field">
            <text class="field-label">
              告警类型
            </text>
            <view class="field-control select-control" @click="showAlarmTypePicker">
              <view class="field-icon i-carbon-warning" />
              <text class="field-value" :class="{ muted: !filterForm.alarm_type_name }">
                {{ filterAlarmTypeLabel }}
              </text>
              <view class="i-carbon-chevron-down arrow-icon" />
            </view>
          </view>

          <view class="filter-field">
            <text class="field-label">
              开始时间
            </text>
            <view class="field-control select-control" @click="startTimePickerVisible = true">
              <view class="field-icon i-carbon-calendar" />
              <text class="field-value" :class="{ muted: !filterForm.startTime }">
                {{ filterForm.startTime || '请选择开始时间' }}
              </text>
              <view
                v-if="filterForm.startTime"
                class="i-carbon-close clear-icon"
                @click.stop="clearTimeField('startTime')"
              />
              <view v-else class="arrow-icon i-carbon-chevron-down" />
            </view>
          </view>

          <view class="filter-field">
            <text class="field-label">
              结束时间
            </text>
            <view class="field-control select-control" @click="endTimePickerVisible = true">
              <view class="field-icon i-carbon-calendar" />
              <text class="field-value" :class="{ muted: !filterForm.endTime }">
                {{ filterForm.endTime || '请选择结束时间' }}
              </text>
              <view
                v-if="filterForm.endTime"
                class="i-carbon-close clear-icon"
                @click.stop="clearTimeField('endTime')"
              />
              <view v-else class="arrow-icon i-carbon-chevron-down" />
            </view>
          </view>

          <view class="filter-field">
            <text class="field-label">
              状态
            </text>
            <view class="field-control select-control" @click="showStatusPicker">
              <view class="field-icon i-carbon-time" />
              <text class="field-value" :class="{ muted: filterForm.status === undefined }">
                {{ filterStatusLabel }}
              </text>
              <view class="arrow-icon i-carbon-chevron-down" />
            </view>
          </view>
        </view>

        <view class="popup-actions mt-32rpx flex gap-16rpx">
          <view class="reset-btn flex-1" @click="resetAdvancedSearch">
            重置
          </view>
          <view class="submit-btn flex-1" @click="applyAdvancedSearch">
            检索
          </view>
        </view>
      </view>
    </sar-popup>

    <sar-picker-popout
      v-model="filterForm.alarm_type_name"
      v-model:visible="alarmTypePickerVisible"
      title="选择告警类型"
      :columns="alarmTypeOptions"
      @change="handleAlarmTypeChange"
    />

    <sar-picker-popout
      v-model="statusPickerValue"
      v-model:visible="statusPickerVisible"
      title="选择状态"
      :columns="statusOptions"
      @change="handleStatusChange"
    />

    <sar-datetime-picker-popout
      v-model="filterForm.startTime"
      v-model:visible="startTimePickerVisible"
      title="选择开始时间"
      type="yMdhms"
      value-format="YYYY-MM-DD HH:mm:ss"
    />

    <sar-datetime-picker-popout
      v-model="filterForm.endTime"
      v-model:visible="endTimePickerVisible"
      title="选择结束时间"
      type="yMdhms"
      value-format="YYYY-MM-DD HH:mm:ss"
    />
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
  min-width: 0;

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
    min-width: 0;
    font-size: 28rpx;
    line-height: 1.5;

    &::placeholder {
      color: #9ca3af;
    }
  }

  .i-carbon-close {
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      color: #ef4444;
      transform: scale(0.95);
    }
  }
}

.advanced-section {
  flex-shrink: 0;

  .advanced-trigger {
    transition: all 0.2s ease;

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

.advanced-popup {
  width: 100vw;
  max-height: 82vh;
  padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom));
  border-radius: 28rpx 28rpx 0 0;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;

  .close-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    background: #f3f4f6;
    transition: all 0.2s ease;

    &:active {
      background: #e5e7eb;
      transform: scale(0.95);
    }
  }
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.validation-banner {
  min-height: 68rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #fecaca;
  border-radius: 16rpx;
  background: #fef2f2;
  box-sizing: border-box;

  .validation-text {
    flex: 1;
    min-width: 0;
    color: #dc2626;
    font-size: 26rpx;
    font-weight: 600;
    line-height: 1.4;
  }
}

.filter-field {
  .field-label {
    display: block;
    margin-bottom: 12rpx;
    font-size: 26rpx;
    color: #4b5563;
    font-weight: 600;
  }

  .field-control {
    min-height: 76rpx;
    display: flex;
    align-items: center;
    gap: 14rpx;
    padding: 0 22rpx;
    border-radius: 16rpx;
    background: #f9fafb;
    border: 1rpx solid #e5e7eb;
    box-sizing: border-box;
  }

  .field-icon,
  .arrow-icon,
  .clear-icon {
    flex-shrink: 0;
    width: 30rpx;
    height: 30rpx;
    color: #6b7280;
  }

  .field-icon {
    color: #3b82f6;
  }

  .field-input {
    flex: 1;
    min-width: 0;
    font-size: 28rpx;
    color: #1f2937;
  }

  .field-value {
    flex: 1;
    min-width: 0;
    font-size: 28rpx;
    color: #1f2937;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.muted {
      color: #9ca3af;
    }
  }

  .select-control {
    cursor: pointer;
  }

  .clear-icon {
    color: #9ca3af;
  }
}

.popup-actions {
  .reset-btn,
  .submit-btn {
    height: 76rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18rpx;
    font-size: 28rpx;
    font-weight: 700;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
    }
  }

  .reset-btn {
    background: #f3f4f6;
    color: #4b5563;
  }

  .submit-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    box-shadow: 0 8rpx 18rpx rgba(37, 99, 235, 0.18);
  }
}
</style>
