import { http } from '@/http/alova'

// ==================== 数据类型定义 ====================

/**
 * 告警状态枚举
 */
export enum AlarmStatus {
  /** 未处理 */
  UNPROCESSED = 0,
  /** 已处理 */
  PROCESSED = 1,
  /** 误报 */
  FALSE_ALARM = 2,
}

/**
 * 告警列表请求参数
 */
export interface IAlarmListReq {
  page: number
  pageSize: number
  deviceName?: string
  status?: AlarmStatus
  alarm_type_name?: string
  startTime?: string
  endTime?: string
}

/**
 * 告警列表项
 */
export interface IAlarmListItem {
  id: number
  deviceName?: string
  modelname?: string
  alarmTypeId?: number
  status: AlarmStatus
  alarmImg?: string
  createTime: string
  alarmTime: string
}

/**
 * 告警列表响应数据
 */
export interface IAlarmListRes {
  list: IAlarmListItem[]
  total: number
  size: number
}

/**
 * 告警详情请求参数
 */
export interface IAlarmDetailReq {
  alarm_id: number
}

/**
 * 告警详情通道信息
 */
export interface IAlarmDetailChannel {
  national_num?: string
  channel?: string
}

/**
 * 告警详情响应数据
 */
export interface IAlarmDetailRes {
  alarm_id: number
  status: AlarmStatus
  alarm_img?: string | string[] // 支持单张图片或多张图片数组
  modelname?: string
  device_name?: string
  alarm_time: string
  detail?: IAlarmDetailChannel
  address?: string
  notice_type?: string
  notice_unames?: string[]
  videoUrl?: string
}

/**
 * 更新告警状态请求参数
 */
export interface IAlarmStatusReq {
  alarmId: number
  status: AlarmStatus
}

/**
 * 告警分类请求参数
 */
export interface IAlarmCategoryReq {
  page: number
  pageSize: number
  query?: string
}

/**
 * 告警分类项
 */
export interface IAlarmCategoryItem {
  alarmCategory: string | null
  alarmCode: string
  alarmTypeId: number | null
  alarmTypeName: string
  createTime: string | null
  fileId: number | null
  fileName: string | null
  id: number
  isUse: number | null
  updateTime: string | null
}

/**
 * 告警分类响应数据
 */
export interface IAlarmCategoryRes {
  list: IAlarmCategoryItem[]
  total: number
  size: number
}

// ==================== 告警统计接口 ====================

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

/**
 * 获取大屏告警统计信息
 */
export function getScreenAlarmStatistics() {
  return http.Get<IAlarmStatItem[]>('/api/alarm/v2/stat/screenAlarmStatistics')
}

// ==================== API 接口定义 ====================

/**
 * 获取告警列表
 * @param params 请求参数
 * @returns 告警列表数据
 */
export function getAlarmList(params: IAlarmListReq) {
  return http.Get<IAlarmListRes>('/ai/api/alarm/alarmCameraListAll', {
    params,
  })
}

/**
 * 根据ID获取告警详情
 * @param params 请求参数
 * @returns 告警详情数据
 */
export function getAlarmDetailByID(params: IAlarmDetailReq) {
  return http.Get<IAlarmDetailRes>('/ai/api/alarm/alarmRecordDetail', {
    params,
  })
}

/**
 * 根据ID更新告警状态
 * @param params 请求参数
 * @returns 更新结果
 */
export function updateAlarmStatusByID(params: IAlarmStatusReq) {
  return http.Get<any>('/ai/api/alarm/handle', {
    params,
  })
}

/**
 * 获取告警分类列表
 * @param params 请求参数
 * @returns 告警分类列表数据
 */
export function getAlarmCategory(params: IAlarmCategoryReq) {
  return http.Get<IAlarmCategoryRes>('/ai/api/ruleAlarm/getAlarmCategory', {
    params,
  })
}
