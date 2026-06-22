import type { INationalChannel, INationalDevice, IProxyDevice } from '@/api/device'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 设备类型枚举
 */
export enum DeviceType {
  NATIONAL = 'national', // 国标设备
  PROXY = 'proxy', // 拉流设备
}

/**
 * 设备管理状态管理
 */
export const useDeviceStore = defineStore(
  'device',
  () => {
    // ==================== 状态定义 ====================

    // 当前选中的设备类型
    const selectedDeviceType = ref<DeviceType>(DeviceType.NATIONAL)

    // 当前选中的国标设备信息
    const selectedNationalDevice = ref<INationalDevice | null>(null)

    // 当前选中的通道信息
    const selectedChannel = ref<INationalChannel | null>(null)

    // 当前选中的拉流设备信息
    const selectedProxyDevice = ref<IProxyDevice | null>(null)

    // ==================== Actions 方法 ====================

    /**
     * 清除所有选中状态
     */
    const clearSelections = () => {
      selectedNationalDevice.value = null
      selectedChannel.value = null
      selectedProxyDevice.value = null
    }

    /**
     * 设置设备类型并清除相关选中状态
     */
    const setDeviceType = (type: DeviceType) => {
      selectedDeviceType.value = type
      clearSelections()
    }

    /**
     * 设置选中的国标设备
     */
    const setSelectedNationalDevice = (device: INationalDevice | null) => {
      selectedNationalDevice.value = device
      // 清除通道选择
      selectedChannel.value = null
    }

    /**
     * 设置选中的通道
     */
    const setSelectedChannel = (channel: INationalChannel | null) => {
      selectedChannel.value = channel
    }

    /**
     * 设置选中的拉流设备
     */
    const setSelectedProxyDevice = (device: IProxyDevice | null) => {
      selectedProxyDevice.value = device
    }

    return {
      // 状态
      selectedDeviceType,
      selectedNationalDevice,
      selectedChannel,
      selectedProxyDevice,

      // Actions 方法
      setDeviceType,
      setSelectedNationalDevice,
      setSelectedChannel,
      setSelectedProxyDevice,
      clearSelections,
    }
  },
  {
    // 关闭持久化存储
    persist: true,
  },
)
