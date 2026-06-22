import { VIDEO_API_BASE_URL } from '@/utils/video/request'

export const DEFAULT_AREA_SET = {
  width: 500,
  height: 300,
  canvasType: 'all',
  list: []
}

export const NOTIFICATE_TYPE_OPTIONS = [
  { label: '微信', value: '0' },
  { label: '短信', value: '1' }
]

export const ENGINE_OPTIONS = [
  { label: '产品自带AI', value: '0' },
  { label: '云化AI', value: '1' }
]

export const ALARM_STATUS_OPTIONS = [
  { label: '未处理', value: 0, type: 'danger' },
  { label: '已处理', value: 1, type: 'success' },
  { label: '误报', value: 2, type: 'warning' }
]

export const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function cloneJson(value) {
  if (value === undefined || value === null) return value
  return JSON.parse(JSON.stringify(value))
}

export function normalizeList(data) {
  if (!data) return { list: [], total: 0, size: 0 }
  if (Array.isArray(data)) return { list: data, total: data.length, size: data.length }
  if (Array.isArray(data.list)) {
    return {
      list: data.list,
      total: Number(data.total || data.list.length || 0),
      size: Number(data.size || data.list.length || 0)
    }
  }
  if (Array.isArray(data.records)) {
    return {
      list: data.records,
      total: Number(data.total || data.records.length || 0),
      size: Number(data.size || data.records.length || 0)
    }
  }
  return { list: [], total: 0, size: 0 }
}

export function normalizeAreaSet(value) {
  if (!value) return cloneJson(DEFAULT_AREA_SET)
  if (typeof value === 'string') {
    try {
      return normalizeAreaSet(JSON.parse(value))
    } catch (error) {
      return cloneJson(DEFAULT_AREA_SET)
    }
  }
  return {
    ...cloneJson(DEFAULT_AREA_SET),
    ...cloneJson(value),
    list: Array.isArray(value.list) ? cloneJson(value.list) : []
  }
}

export function toImageUrl(url) {
  if (!url) return ''
  if (/^(https?:)?\/\//i.test(url) || /^data:/i.test(url) || url.startsWith('blob:')) return url
  return `${VIDEO_API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export function pickLiveUrl(data) {
  if (!data) return ''
  const isHttps = window.location.protocol === 'https:'
  return isHttps
    ? data.wss_flv || data.ws_flv || ''
    : data.ws_flv || data.wss_flv || ''
}

export function formatFileSize(size = 0) {
  const value = Number(size || 0)
  if (value === 0) return '0 B'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(2)} KB`
  if (value < 1024 * 1024 * 1024) return `${(value / 1024 / 1024).toFixed(2)} MB`
  return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function defaultTimelines() {
  return WEEK_DAYS.map((day) => ({ day, timelines: [] }))
}

export function normalizeTimelines(value) {
  if (!Array.isArray(value) || value.length === 0) return defaultTimelines()
  const map = new Map(value.map((item) => [item.day, Array.isArray(item.timelines) ? item.timelines : []]))
  return WEEK_DAYS.map((day) => ({
    day,
    timelines: cloneJson(map.get(day) || [])
  }))
}

export function createObjectUrl(file) {
  if (!file) return ''
  return URL.createObjectURL(file)
}

