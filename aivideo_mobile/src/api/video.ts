import type { StreamData } from '@/utils/videoStream'
import { http } from '@/utils/request'

/**
 * 获取设备实时视频流信息
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @returns 流媒体数据
 */
export function getDeviceLiveStream(deviceId: string, channelId: string): Promise<StreamData> {
  return http<StreamData>({
    url: '/api/device/live-stream',
    method: 'GET',
    data: {
      deviceId,
      channelId,
    },
  })
}

/**
 * 开始播放实时视频
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @returns 播放会话信息
 */
export function startLivePlay(deviceId: string, channelId: string) {
  return http({
    url: '/api/device/live-play/start',
    method: 'POST',
    data: {
      deviceId,
      channelId,
    },
  })
}

/**
 * 停止播放实时视频
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @returns 停止结果
 */
export function stopLivePlay(deviceId: string, channelId: string) {
  return http({
    url: '/api/device/live-play/stop',
    method: 'POST',
    data: {
      deviceId,
      channelId,
    },
  })
}

/**
 * 获取视频截图
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @returns 截图URL
 */
export function captureVideoSnapshot(deviceId: string, channelId: string) {
  return http<{ imageUrl: string }>({
    url: '/api/device/live-capture',
    method: 'POST',
    data: {
      deviceId,
      channelId,
    },
  })
}

/**
 * PTZ控制
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param command PTZ命令
 * @param speed 速度 (1-8)
 */
export function controlPTZ(
  deviceId: string,
  channelId: string,
  command: 'up' | 'down' | 'left' | 'right' | 'stop' | 'zoomIn' | 'zoomOut',
  speed: number = 4,
) {
  return http({
    url: '/api/device/ptz-control',
    method: 'POST',
    data: {
      deviceId,
      channelId,
      command,
      speed,
    },
  })
}

/**
 * 调用预置位
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param presetId 预置位ID
 */
export function callPreset(deviceId: string, channelId: string, presetId: number) {
  return http({
    url: '/api/device/preset/call',
    method: 'POST',
    data: {
      deviceId,
      channelId,
      presetId,
    },
  })
}

/**
 * 设置预置位
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param presetId 预置位ID
 * @param presetName 预置位名称
 */
export function setPreset(
  deviceId: string,
  channelId: string,
  presetId: number,
  presetName: string,
) {
  return http({
    url: '/api/device/preset/set',
    method: 'POST',
    data: {
      deviceId,
      channelId,
      presetId,
      presetName,
    },
  })
}
