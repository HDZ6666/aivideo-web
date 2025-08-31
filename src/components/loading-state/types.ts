/**
 * 加载状态组件类型定义
 * 遵循"最小导出"原则，只导出外部真正需要的类型
 */

// 加载状态类型
export type LoadingStateType = 'loading' | 'error' | 'empty' | 'success'

// 组件属性接口（外部使用时需要）
export interface LoadingStateProps {
  /** 当前状态类型 */
  state: LoadingStateType
  /** 加载中的提示文字 */
  loadingText?: string
  /** 错误状态的提示文字 */
  errorText?: string
  /** 空状态的提示文字 */
  emptyText?: string
  /** 空状态的描述文字 */
  emptyDescription?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 重试按钮文字 */
  retryText?: string
  /** 自定义图标 */
  customIcon?: string
  /** 是否使用紧凑模式（较小的间距和尺寸） */
  compact?: boolean
}

// 组件事件接口（外部类型提示需要）
export interface LoadingStateEmits {
  retry: []
}
