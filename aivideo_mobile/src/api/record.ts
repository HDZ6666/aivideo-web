import { http } from '@/http/alova'

// ==================== 数据类型定义 ====================

/**
 * 录像片段信息（根据真实API格式定义）
 */
export interface IRecordSegment {
  address: string | null
  deviceId: string
  endTime: string
  filePath: string | null
  fileSize: string // API返回字符串格式的文件大小
  name: string
  recorderId: string | null
  secrecy: number
  startTime: string
  type: 'time' | 'alarm' // 录像类型：定时录像或告警录像
}

/**
 * 录像列表请求参数
 */
export interface IRecordListReq {
  deviceId: string
  channelId: string
  startTime: string // 开始时间，格式：YYYY-MM-DD HH:mm:ss
  endTime: string // 结束时间，格式：YYYY-MM-DD HH:mm:ss
}

/**
 * 录像列表响应数据（根据真实API格式定义）
 */
export interface IRecordListRes {
  channelId: string
  count: number
  deviceId: string
  lastTime: string | null
  name: string
  recordList: IRecordSegment[]
  sn: string
  sumNum: number
}

/**
 * 录像播放地址信息（根据真实API格式定义）
 */
export interface IRecordPlayInfo {
  app: string
  downLoadFilePath: string | null
  endTime: string
  flv: string
  fmp4: string
  hls: string
  https_flv: string
  https_fmp4: string
  https_hls: string
  https_ts: string
  ip: string | null
  mediaServerId: string
  progress: number
  rtc: string
  rtcs: string
  rtmp: string
  rtmps: string | null
  rtsp: string
  rtsps: string | null
  startTime: string
  stream: string
  tracks: Array<{
    channels: number
    codec_id: number
    codec_id_name: string
    codec_type: number
    fps: number
    frames: number
    gop_interval_ms: number
    gop_size: number
    height: number
    key_frames: number
    loss: number
    ready: boolean
    sample_bit: number
    sample_rate: number
    width: number
  }>
  ts: string
  ws_flv: string
  ws_fmp4: string
  ws_hls: string
  ws_ts: string
  wss_flv: string
  wss_fmp4: string
  wss_hls: string
  wss_ts: string | null
}

// ==================== API 接口定义 ====================

/**
 * 获取国标设备录像列表
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 录像列表数据
 */
export function getNationalRecordList(
  deviceId: string,
  channelId: string,
  startTime: string,
  endTime: string,
) {
  return http.Get<IRecordListRes>(`/api/gb_record/query/${deviceId}/${channelId}`, {
    params: {
      startTime,
      endTime,
    },
  })
}

/**
 * 获取录像播放地址
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 录像播放地址信息
 */
export function getRecordPlayUrl(
  deviceId: string,
  channelId: string,
  startTime: string,
  endTime: string,
) {
  return http.Get<IRecordPlayInfo>(`/api/playback/start/${deviceId}/${channelId}`, {
    params: {
      startTime,
      endTime,
    },
  })
}
