/**
 * SmartImage 智能图片组件
 *
 * 功能特性：
 * - 自动处理图片加载状态（加载中显示 image 图标、失败显示 no-image 图标）
 * - 内置图片预览功能，只预览当前图片
 * - 使用 Carbon Icons 显示状态图标
 * - 响应式设计，支持自定义尺寸和样式
 * - 无背景色，适配父组件背景
 * - 简洁的状态显示，无加载动画和文字
 * - 智能延迟显示：src 为空时立即显示默认图标，src 变化时延迟显示加载状态
 *
 * 使用示例：
 * ```vue
 * <template>
 *   <!-- 基础使用 -->
 *   <SmartImage :src="imageUrl" />
 *
 *   <!-- 完整配置 -->
 *   <SmartImage
 *     :src="imageUrl"
 *     :width="400"
 *     :height="300"
 *     mode="aspectFill"
 *     border-radius="12rpx"
 *     :enable-preview="true"
 *     icon-size="64rpx"
 *     :show-state-text="true"
 *     text-size="28rpx"
 *     :loading-delay="300"
 *     @load="onImageLoad"
 *     @error="onImageError"
 *   />
 * </template>
 * ```
 */

import SmartImage from './SmartImage.vue'

export { SmartImage }
export default SmartImage

// 导出类型定义
export type {
  ImageLoadState,
  ImageMode,
  SmartImageEmits,
  SmartImageProps,
} from './types'
