import { isH5, isMp } from './platform'

/**
 * 视频流数据接口
 */
export interface StreamData {
  app: string
  stream: string
  flv?: string
  fmp4?: string
  hls?: string
  https_flv?: string
  https_fmp4?: string
  https_hls?: string
  rtmp?: string
  rtsp?: string
  rtc?: string
  rtcs?: string
  ws_flv?: string
  ws_fmp4?: string
  ws_hls?: string
  wss_flv?: string
  wss_fmp4?: string
  wss_hls?: string
  tracks?: Array<{
    codec_id: number
    codec_id_name: string
    codec_type: number
    width: number
    height: number
    fps: number
  }>
}

/**
 * 播放器配置接口
 */
export interface PlayerConfig {
  platform: 'h5' | 'mp' | 'app'
  format: string
  url: string
  codec?: string
  useHttps?: boolean
  lowLatency?: boolean
}

/**
 * 获取最优的视频流配置
 * @param streamData 流媒体数据
 * @param options 配置选项
 * @returns 播放器配置
 */
export function getOptimalStreamConfig(
  streamData: StreamData,
  options: {
    preferHttps?: boolean
    lowLatency?: boolean
  } = {},
): PlayerConfig {
  const { preferHttps = false, lowLatency = false } = options

  // 小程序平台配置
  if (isMp) {
    return getMiniProgramConfig(streamData, { preferHttps, lowLatency })
  }

  // H5平台配置
  if (isH5) {
    return getH5Config(streamData, { preferHttps, lowLatency })
  }

  // App平台配置（使用类似H5的策略）
  return getH5Config(streamData, { preferHttps, lowLatency })
}

/**
 * 获取小程序平台的最优配置
 */
function getMiniProgramConfig(
  streamData: StreamData,
  options: { preferHttps?: boolean, lowLatency?: boolean },
): PlayerConfig {
  const { preferHttps, lowLatency } = options

  // 低延迟模式：优先 RTMP
  if (lowLatency && streamData.rtmp) {
    return {
      platform: 'mp',
      format: 'rtmp',
      url: streamData.rtmp,
      lowLatency: true,
    }
  }

  // HTTPS优先模式
  if (preferHttps) {
    if (streamData.https_flv) {
      return {
        platform: 'mp',
        format: 'flv',
        url: streamData.https_flv,
        useHttps: true,
      }
    }
    if (streamData.https_hls) {
      return {
        platform: 'mp',
        format: 'hls',
        url: streamData.https_hls,
        useHttps: true,
      }
    }
  }

  // 默认优先级：RTMP > FLV > HLS
  if (streamData.rtmp) {
    return {
      platform: 'mp',
      format: 'rtmp',
      url: streamData.rtmp,
    }
  }

  if (streamData.flv) {
    return {
      platform: 'mp',
      format: 'flv',
      url: streamData.flv,
    }
  }

  if (streamData.hls) {
    return {
      platform: 'mp',
      format: 'hls',
      url: streamData.hls,
    }
  }

  throw new Error('小程序平台未找到可用的视频流格式')
}

/**
 * 获取H5平台的最优配置
 */
function getH5Config(
  streamData: StreamData,
  options: { preferHttps?: boolean, lowLatency?: boolean },
): PlayerConfig {
  const { preferHttps, lowLatency } = options

  // 检测浏览器对H265的支持
  const supportsH265 = checkH265Support()
  const codec = getVideoCodec(streamData)

  // HTTPS优先模式
  if (preferHttps) {
    if (streamData.https_hls) {
      return {
        platform: 'h5',
        format: 'hls',
        url: streamData.https_hls,
        codec,
        useHttps: true,
      }
    }
    if (streamData.https_fmp4) {
      return {
        platform: 'h5',
        format: 'fmp4',
        url: streamData.https_fmp4,
        codec,
        useHttps: true,
      }
    }
  }

  // H5默认优先级：HLS > FMP4 > FLV
  if (streamData.hls) {
    return {
      platform: 'h5',
      format: 'hls',
      url: streamData.hls,
      codec,
    }
  }

  if (streamData.fmp4) {
    return {
      platform: 'h5',
      format: 'fmp4',
      url: streamData.fmp4,
      codec,
    }
  }

  if (streamData.flv) {
    return {
      platform: 'h5',
      format: 'flv',
      url: streamData.flv,
      codec,
    }
  }

  throw new Error('H5平台未找到可用的视频流格式')
}

/**
 * 检测浏览器是否支持H265
 */
function checkH265Support(): boolean {
  // #ifdef H5
  const video = document.createElement('video')
  return video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== ''
  // #endif

  // #ifndef H5
  return false
  // #endif
}

/**
 * 获取视频编码信息
 */
function getVideoCodec(streamData: StreamData): string {
  if (streamData.tracks && streamData.tracks.length > 0) {
    const videoTrack = streamData.tracks.find(track => track.codec_type === 0)
    return videoTrack?.codec_id_name || 'unknown'
  }
  return 'unknown'
}

/**
 * 格式化视频流信息用于调试
 */
export function formatStreamInfo(streamData: StreamData): string {
  const config = getOptimalStreamConfig(streamData)
  const codec = getVideoCodec(streamData)

  return `平台: ${config.platform}, 格式: ${config.format}, 编码: ${codec}, URL: ${config.url}`
}

/**
 * 检查流是否可用
 */
export async function checkStreamAvailability(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  }
  catch {
    return false
  }
}
