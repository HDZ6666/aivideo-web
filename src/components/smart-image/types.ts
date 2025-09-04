/**
 * SmartImage 组件类型定义
 */

/** 图片显示模式 */
export type ImageMode = 'aspectFill' | 'aspectFit'

/** 图片加载状态 */
export type ImageLoadState = 'loading' | 'success' | 'error'

/** SmartImage 组件属性接口 */
export interface SmartImageProps {
  /** 图片源地址（必需） */
  src: string
  /** 是否启用图片预览功能，默认为 true */
  enablePreview?: boolean
  /** 图片宽度 */
  width?: string | number
  /** 图片高度 */
  height?: string | number
  /** 图片显示模式，默认为 'aspectFill' */
  mode?: ImageMode
  /** 圆角样式，如 '12rpx' */
  borderRadius?: string
  /** 状态图标大小，默认为 '48rpx' */
  iconSize?: string | number
  /** 是否显示状态文字，默认为 false */
  showStateText?: boolean
  /** 状态文字大小，默认为 '24rpx' */
  textSize?: string | number
  /** 延迟显示加载状态的时间（毫秒），默认为 200ms */
  loadingDelay?: number
}

/** SmartImage 组件事件接口 */
export interface SmartImageEmits {
  /** 图片加载成功事件 */
  (e: 'load', event: any): void
  /** 图片加载失败事件 */
  (e: 'error', error: any): void
}
