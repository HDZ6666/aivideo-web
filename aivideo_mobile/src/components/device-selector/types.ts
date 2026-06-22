/**
 * 设备选择器组件类型定义
 * 遵循"最小导出"原则，只导出外部真正需要的类型
 */

import type { DeviceType } from '@/store/device'

// 设备通道信息（外部处理事件时需要）
export interface DeviceChannelInfo {
  deviceType: DeviceType
  deviceName: string
  channelName: string
  // 国标设备字段
  deviceId?: string
  channelId?: string
  // 拉流设备字段
  app?: string
  stream?: string
  mediaServerId?: string
}

// 设备选择器事件类型（外部类型提示需要）
export interface DeviceSelectorEmits {
  'device-type-change': [deviceType: DeviceType]
  'device-change': [device: DeviceChannelInfo]
}
