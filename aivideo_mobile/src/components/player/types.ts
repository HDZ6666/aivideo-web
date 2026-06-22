/**
 * 播放器组件类型定义
 * 遵循"最小导出"原则，只导出外部真正需要的类型
 */

// 播放信息（外部构造播放参数时需要）
export interface PlayInfo {
  url: string
  type: 'hls' | 'rtc' | 'rtmp' | 'flv'
  deviceId?: string
  channelId?: string
  app?: string
  stream?: string
  mediaServerId?: string
}

// 播放器事件类型（外部处理事件时需要）
export interface PlayerEmits {
  ready: []
  error: [error: any]
}
