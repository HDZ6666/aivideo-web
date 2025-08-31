/**
 * 播放器组件统一导出
 */

// 主要播放器组件导出（基于实际使用情况）
export { default as HlsPlayer } from './components/hls-player.vue'

// 导出类型定义
export type * from './types'

// 其他播放器组件（按需导出，当前未发现实际使用，可考虑移除）
// export { default as RtcPlayer } from './components/rtc-player.vue'
// export { default as RtcPlayerV2 } from './components/rtcPlayer.vue'
