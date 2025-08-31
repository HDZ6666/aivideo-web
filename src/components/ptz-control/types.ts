/**
 * 云台控制组件类型定义
 */

// 云台控制相关类型定义（统一管理，避免重复定义）
export interface ControlParams {
  ptz: {
    speed: number
  }
  preset: {
    id: number
  }
  cruise: {
    groupId: number
    speed: number
    time: number
  }
  scan: {
    groupId: number
    speed: number
  }
}

export interface CruiseParams {
  groupId: number
  speed: number
  time: number
}

export interface ScanParams {
  groupId: number
  speed: number
}

// 云台控制事件载荷类型
export interface ControlResult {
  type: 'ptz' | 'device'
  action: string
  data?: any
}

export interface ControlError {
  type: 'ptz' | 'device'
  action: string
  message: string
}

// 云台控制事件类型（保留用于向后兼容，但建议使用上面的载荷类型）
export interface PtzControlEmits {
  'control-success': [result: ControlResult]
  'control-error': [error: ControlError]
}

// 云台控制组件显示配置
export interface PtzControlDisplayConfig {
  showSpeedControl?: boolean
  showDirectionControl?: boolean
  showZoomControl?: boolean
  showPresetControl?: boolean
  showCruiseControl?: boolean
  showScanControl?: boolean
}
