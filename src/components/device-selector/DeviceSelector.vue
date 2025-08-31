<script setup lang="ts">
import type { DeviceChannelInfo } from './types'
import type { INationalDevice, IProxyDevice } from '@/api/device'
import { getDeviceChannels, getNationalDevices, getProxyDevices } from '@/api/device'
import { mockGetDeviceChannels, mockGetNationalDevices, mockGetProxyDevices } from '@/mock/device'
import { DeviceType, useDeviceStore } from '@/store/device'

// 内部类型定义（不对外导出）
interface DeviceTypeOption {
  label: string
  value: DeviceType
}

interface CascaderOption {
  label: string
  value: string
  children?: CascaderOption[]
  device?: INationalDevice | IProxyDevice // 保存完整的设备信息
}

interface Emits {
  (e: 'deviceTypeChange', deviceType: DeviceType): void
  (e: 'deviceChange', device: DeviceChannelInfo): void
}

const emit = defineEmits<Emits>()

const deviceStore = useDeviceStore()

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

// 级联选择器相关状态
const cascaderVisible = ref(false)
const cascaderValue = ref<string>('')
const cascaderOptions = ref<CascaderOption[]>([])
const displayText = ref<string>('')

onMounted(() => {
  initializeComponent()
})

// ===== 初始化相关函数 =====

/**
 * 初始化组件
 */
async function initializeComponent() {
  const currentDeviceType = deviceStore.selectedDeviceType

  // 初始化设备类型选择器状态
  const currentOption = deviceTypeOptions.find(option => option.value === currentDeviceType)
  if (currentOption) {
    typePickerValue.value = currentOption.value
    typePickerLabel.value = currentOption.label
  }

  // 初始化设备选择状态
  if (currentDeviceType === DeviceType.NATIONAL) {
    // 初始化国标设备选择
    const selectedDevice = deviceStore.selectedNationalDevice
    const selectedChannel = deviceStore.selectedChannel

    if (selectedDevice && selectedChannel) {
      await loadNationalDevices()
      const deviceOption = cascaderOptions.value.find(option => option.value === selectedDevice.deviceId)
      if (deviceOption) {
        await loadChannelData(selectedDevice.deviceId)
      }
      cascaderValue.value = selectedChannel.channelId
      displayText.value = `${selectedDevice.name} / ${selectedChannel.name}`
    }
    else {
      cascaderValue.value = ''
      displayText.value = '请选择国标设备和通道'
    }
  }
  else {
    // 初始化拉流设备选择
    const selectedDevice = deviceStore.selectedProxyDevice

    if (selectedDevice) {
      await loadProxyDevices()
      cascaderValue.value = selectedDevice.id.toString()
      displayText.value = selectedDevice.name
    }
    else {
      cascaderValue.value = ''
      displayText.value = '请选择拉流设备'
    }
  }
}

/**
 * 处理设备类型变更
 */
async function handleTypePickerChange(value: DeviceType) {
  try {
    // 重置组件状态
    cascaderOptions.value = []
    cascaderValue.value = ''
    displayText.value = ''

    // 触发设备类型变更事件
    const option = deviceTypeOptions.find(opt => opt.value === value)
    if (option) {
      typePickerLabel.value = option.label
    }
    emit('deviceTypeChange', value)

    // 根据设备类型加载设备数据
    if (value === DeviceType.NATIONAL) {
      displayText.value = '请选择国标设备和通道'
      await loadNationalDevices()
    }
    else {
      displayText.value = '请选择拉流设备'
      await loadProxyDevices()
    }
  }
  catch (error) {
    console.error('设备类型变更失败:', error)
  }
}

function handleShowDevicePicker() {
  cascaderVisible.value = true
}

function handleShowTypePicker() {
  typePickerVisible.value = true
}

// ===== 数据加载相关函数 =====

/**
 * 加载国标设备数据
 */
async function loadNationalDevices() {
  try {
    const response = await getNationalDevices(1, 50)
    cascaderOptions.value = formatOptions(response.list, 'national-device')
  }
  catch (error) {
    const response = await mockGetNationalDevices(1, 50)
    cascaderOptions.value = formatOptions(response.list, 'national-device')
  }
}

/**
 * 加载拉流设备数据
 */
async function loadProxyDevices() {
  try {
    const response = await getProxyDevices(1, 50)
    cascaderOptions.value = formatOptions(response.list, 'proxy-device')
  }
  catch (error) {
    const response = await mockGetProxyDevices(1, 50)
    cascaderOptions.value = formatOptions(response.list, 'proxy-device')
  }
}

/**
 * 加载通道数据
 */
async function loadChannelData(deviceId: string) {
  if (!deviceId)
    return

  try {
    const response = await getDeviceChannels(deviceId, 1, 50)
    cascaderOptions.value = cascaderOptions.value.map((option) => {
      if (option.value === deviceId) {
        return {
          ...option,
          children: formatOptions(response.list, 'channel'),
        }
      }
      return option
    })
  }
  catch (error) {
    const response = await mockGetDeviceChannels(deviceId, 1, 50)
    cascaderOptions.value = cascaderOptions.value.map((option) => {
      if (option.value === deviceId) {
        return {
          ...option,
          children: formatOptions(response.list, 'channel'),
        }
      }
      return option
    })
    console.error('加载通道数据失败:', error)
  }
}

/**
 * 格式化选项数据
 */
function formatOptions(items: any[], type: 'national-device' | 'proxy-device' | 'channel'): CascaderOption[] {
  return items.map(item => ({
    label: item.name,
    value: type === 'national-device'
      ? item.deviceId
      : type === 'proxy-device'
        ? item.id?.toString()
        : item.channelId,
    children: type === 'national-device' ? [] : undefined,
    device: item,
  }))
}

/**
 * 处理选择器选择事件（选择但未确认）
 */
async function handleCascaderSelect(option: CascaderOption, columnIndex: number) {
  if (typePickerValue.value === DeviceType.NATIONAL) {
    // 国标设备：选择设备后加载通道
    if (columnIndex === 0) { // 选择的是第一列（设备）
      await loadChannelData(option.value)
    }
  }
}

/**
 * 处理设备选择确认
 */
function handleCascaderChange(_value: string, selectedOptions: any) {
  if (!selectedOptions || selectedOptions.length === 0)
    return

  const deviceChannelInfo = createDeviceChannelInfo(selectedOptions)
  if (deviceChannelInfo) {
    // 更新显示文本
    if (typePickerValue.value === DeviceType.NATIONAL) {
      displayText.value = `${deviceChannelInfo.deviceName} / ${deviceChannelInfo.channelName}`
    }
    else {
      displayText.value = deviceChannelInfo.deviceName
    }

    // 关闭选择器
    cascaderVisible.value = false

    // 触发设备变更事件
    emit('deviceChange', deviceChannelInfo)
  }
}

/**
 * 创建设备通道信息对象
 */
function createDeviceChannelInfo(selectedOptions: any[]): DeviceChannelInfo | null {
  if (!selectedOptions || selectedOptions.length === 0)
    return null

  const deviceType = typePickerValue.value as DeviceType
  const deviceOption = selectedOptions[0]
  const channelOption = selectedOptions[1]

  // 基础信息
  const result: DeviceChannelInfo = {
    deviceType,
    deviceName: deviceOption.label,
    channelName: deviceOption.label,
    deviceId: undefined,
    channelId: undefined,
    app: undefined,
    stream: undefined,
    mediaServerId: undefined,
  }

  // 根据设备类型设置特定字段
  if (deviceType === DeviceType.NATIONAL) {
    result.channelName = channelOption?.label
    result.deviceId = deviceOption.value
    result.channelId = channelOption?.value
  }
  else {
    const proxyDevice = deviceOption.device as IProxyDevice
    result.app = proxyDevice?.app
    result.stream = proxyDevice?.stream
    result.mediaServerId = proxyDevice?.mediaServerId
  }

  return result
}
</script>

<template>
  <view class="device-channel-selector">
    <view class="selector-container bg-white p-24rpx shadow-gray-200/60 shadow-lg">
      <view class="flex items-center justify-between gap-24rpx">
        <!-- 左侧：设备通道信息显示区域 -->
        <view class="device-info-section flex-1" @click="handleShowDevicePicker">
          <view class="device-info-display flex cursor-pointer items-center px-24rpx">
            <text class="flex-1 text-28rpx font-medium" :class="displayText ? 'text-gray-800' : 'text-gray-400'">
              {{ displayText }}
            </text>
            <view class="i-carbon-chevron-right h-24rpx w-24rpx text-gray-400" />
          </view>
        </view>

        <!-- 右侧：设备类型选择区域 -->
        <view class="device-type-section">
          <view class="device-type-trigger flex cursor-pointer items-center" @click="handleShowTypePicker">
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

    <!-- 设备通道级联选择器 -->
    <sar-cascader-popout
      v-model="cascaderValue" v-model:visible="cascaderVisible" :options="cascaderOptions"
      @change="handleCascaderChange" @select="handleCascaderSelect"
    />
  </view>
</template>

<style lang="scss" scoped>
.device-channel-selector {
  width: 100%;
}

.selector-container {
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      8rpx 8rpx 16rpx rgba(163, 177, 198, 0.4),
      -8rpx -8rpx 16rpx rgba(255, 255, 255, 0.8);
  }
}

.device-info-section {
  .device-info-display {
    min-height: 64rpx;
    border-radius: 16rpx;
  }

  .i-carbon-device-desktop {
    flex-shrink: 0;
  }

  .i-carbon-chevron-right {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover .i-carbon-chevron-right {
    transform: translateX(4rpx);
    color: #3b82f6;
  }
}

.device-type-section {
  .device-type-trigger {
    padding: 12rpx 16rpx;
    border-radius: 12rpx;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
    }
  }
}
</style>
