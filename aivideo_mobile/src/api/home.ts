import { http } from '@/http/alova'

// ==================== 首页相关接口 ====================

/**
 * 设备资源统计信息接口
 */
export interface IDeviceResourceInfo {
  /** 通道统计 */
  channel: {
    /** 在线通道数 */
    online: number
    /** 总通道数 */
    total: number
  }
  /** 设备统计 */
  device: {
    /** 在线设备数 */
    online: number
    /** 总设备数 */
    total: number
  }
  /** 代理设备统计 */
  proxy: {
    /** 在线代理设备数 */
    online: number
    /** 总代理设备数 */
    total: number
  }
  /** 推流设备统计 */
  push: {
    /** 在线推流设备数 */
    online: number
    /** 总推流设备数 */
    total: number
  }
}

/**
 * 告警统计项接口
 */
export interface IAlarmStatItem {
  /** 近7天告警数 */
  sevenDayAlarmCount: number
  /** 当日告警数 */
  curDateAlarmCount: number
  /** 当日未处理告警数 */
  curDateAlarmNoHandleCount: number
  /** 告警类型名称 */
  alarmTypeName: string
  /** 近7天未处理告警数 */
  sevenDayAlarmNoHandleCount: number
}

// ==================== API 接口定义 ====================

/**
 * 获取设备资源统计信息
 */
export function getDeviceResourceInfo() {
  return http.Get<IDeviceResourceInfo>('/cockpit/api/proxy/resource/info')
}

/**
 * 获取大屏告警统计信息
 */
export function getScreenAlarmStatistics() {
  return http.Get<IAlarmStatItem[]>('/api/alarm/v2/stat/screenAlarmStatistics')
}
