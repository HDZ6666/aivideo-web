import { http } from '@/http/alova'

// ==================== 数据类型定义 ====================

/**
 * 国标设备信息
 */
export interface INationalDevice {
  deviceId: string
  name: string
  manufacturer?: string
  model?: string
  onLine: boolean
  hostAddress?: string
  transport?: string
  streamMode?: string
  channelCount?: number
  registerTime?: string
  keepaliveTime?: string
  createTime?: string
  asMessageChannel?: boolean
  charset?: string
  expires?: number
  firmware?: string
  geoCoordSys?: string
  groupId?: string
  groupName?: string
  ip?: string
  keepaliveIntervalTime?: number
  localIp?: string
  mediaServerId?: string | null
  mobilePositionSubmissionInterval?: number
  password?: string | null
  port?: number
  sdpIp?: string | null
  sipTransactionInfo?: string | null
  ssrcCheck?: boolean
  streamModeForParam?: number
  subscribeCycleForAlarm?: number
  subscribeCycleForCatalog?: number
  subscribeCycleForMobilePosition?: number
  switchPrimarySubStream?: boolean
  updateTime?: string
}

/**
 * 国标设备通道信息
 */
export interface INationalChannel {
  id: number
  name: string
  deviceId: string
  channelId: string
  status: boolean
  online?: boolean
  ptz?: boolean
  PTZType?: number
  PTZTypeText?: string
  address?: string
  block?: string | null
  businessGroupId?: string | null
  certNum?: string | null
  certifiable?: number
  channelType?: number
  civilCode?: string | null
  createTime?: string
  endTime?: string | null
  errCode?: number
  gpsTime?: string
  groupId?: string | null
  hasAudio?: boolean
  ipAddress?: string | null
  latitude?: number
  latitudeGcj02?: number
  latitudeWgs84?: number
  longitude?: number
  longitudeGcj02?: number
  longitudeWgs84?: number
  manufacture?: string
  model?: string
  owner?: string
  parentId?: string
  parental?: number
  password?: string | null
  port?: number
  registerWay?: number
  safetyWay?: number
  secrecy?: string
  streamId?: string
  subCount?: number
  updateTime?: string
  videoPlayUrl?: string | null
}

/**
 * 拉流设备信息
 */
export interface IProxyDevice {
  id: number
  name: string
  app?: string
  stream?: string
  srcUrl?: string | null
  dstUrl?: string
  status: boolean
  online?: boolean
  enable?: boolean
  enableAudio?: boolean
  enableMp4?: boolean
  enableDisableNoneReader?: boolean
  enableRemoveNoneReader?: boolean
  ffmpegCmdKey?: string
  rtpType?: string
  mediaServerId?: string
  catalogId?: string | null
  categoryId?: string | null
  channel?: string | null
  channelName?: string | null
  deviceIp?: string | null
  gbId?: string | null
  gbStreamId?: number
  groupName?: string | null
  platformId?: string | null
  latitude?: number
  longitude?: number
  streamInfo?: {
    app?: string
    channelId?: string | null
    deviceID?: string | null
    downLoadFilePath?: string | null
    endTime?: string | null
    ip?: string
    mediaServerId?: string
    pause?: boolean
    progress?: number
    startTime?: string | null
    streamId?: string
    tracks?: any[]
    vhost?: string
    flv?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    fmp4?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    hls?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    rtmp?: {
      app?: string
      file?: string
      host?: string
      port?: number
      protocol?: string
      stream?: string
      url?: string
    }
    rtsp?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      stream?: string
      url?: string
    }
    ts?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    ws_flv?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    ws_fmp4?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    ws_ts?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    ws_hls?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    https_flv?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    https_fmp4?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    https_hls?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    https_ts?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    rtmps?: any
    webrtc?: {
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    rtc?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    rtcs?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    rtsps?: any
    stream?: string
    subStream?: boolean
    transactionInfo?: any
    wss_flv?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    wss_fmp4?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    wss_hls?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
    wss_ts?: {
      file?: string
      host?: string
      port?: number
      protocol?: string
      url?: string
    }
  }
  streamKey?: any
  streamType?: any
  timeoutMs?: number
  type?: string
  updateTime?: string
  url?: string
  createTime?: string
}

/**
 * 分页响应数据结构
 */
export interface IPaginationResponse<T = any> {
  list: T[]
  total: number
  page: number
  count: number
}

/**
 * 国标设备播放地址信息
 */
export interface INationalPlayInfo {
  app: string
  downLoadFilePath: string | null
  endTime: string | null
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
  startTime: string | null
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

/**
 * 拉流设备播放地址信息
 */
export interface IProxyPlayInfo {
  app: string
  downLoadFilePath: string | null
  endTime: string | null
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
  startTime: string | null
  stream: string
  tracks: Array<{
    codec_id: number
    codec_id_name: string
    codec_type: number
    duration: number
    fps: number
    frames: number
    gop_interval_ms: number
    gop_size: number
    height: number
    key_frames: number
    ready: boolean
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

// ==================== 设备资源统计接口 ====================

/**
 * 设备资源统计信息接口
 */
export interface IDeviceResourceInfo {
  /** 通道统计 */
  channel: {
    /** 在线通道数 */
    online: number
    /** 总通道数 */
    total: number
  }
  /** 设备统计 */
  device: {
    /** 在线设备数 */
    online: number
    /** 总设备数 */
    total: number
  }
  /** 代理设备统计 */
  proxy: {
    /** 在线代理设备数 */
    online: number
    /** 总代理设备数 */
    total: number
  }
  /** 推流设备统计 */
  push: {
    /** 在线推流设备数 */
    online: number
    /** 总推流设备数 */
    total: number
  }
}

/**
 * 获取设备资源统计信息
 */
export function getDeviceResourceInfo() {
  return http.Get<IDeviceResourceInfo>('/cockpit/api/proxy/resource/info')
}

// ==================== API 接口定义 ====================

/**
 * 获取国标设备列表
 * @param page 页码
 * @param count 每页数量
 * @param query 搜索关键词
 * @param online 在线状态过滤
 */
export function getNationalDevices(
  page: number = 1,
  count: number = 15,
  query: string = '',
  online?: boolean,
) {
  return http.Get<IPaginationResponse<INationalDevice>>('/api/device/query/devices', {
    params: {
      page,
      count,
      query,
      online,
    },
  })
}

/**
 * 获取设备的通道列表（用于详情页）
 * @param deviceId 设备ID
 * @param page 页码
 * @param count 每页数量
 * @param query 搜索关键词
 * @param online 在线状态过滤
 * @param channelType 通道类型过滤
 */
export function getDeviceChannels(
  deviceId: string,
  page: number = 1,
  count: number = 15,
  query: string = '',
  online?: boolean,
  channelType?: string,
) {
  return http.Get<IPaginationResponse<INationalChannel>>(`/api/device/query/devices/${deviceId}/channels`, {
    params: {
      page,
      count,
      query,
      online,
      channelType,
    },
  })
}

/**
 * 获取拉流设备列表
 * @param page 页码
 * @param count 每页数量
 * @param query 搜索关键词
 * @param online 在线状态过滤
 */
export function getProxyDevices(
  page: number = 1,
  count: number = 15,
  query: string = '',
  online?: boolean,
) {
  return http.Get<IPaginationResponse<IProxyDevice>>('/ai/api/device/queryManager/list', {
    params: {
      page,
      pageSize: count, // 注意：拉流设备接口使用 pageSize 参数
      query,
      online,
    },
  })
}

/**
 * 刷新设备状态
 * @param deviceId 设备ID
 */
export function refreshDeviceStatus(deviceId: string) {
  return http.Post<boolean>('/api/device/query/sync', {
    deviceId,
  })
}

/**
 * 获取国标设备播放地址
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param isSubStream 是否子码流，默认false（主码流）
 */
export function getNationalPlayUrl(
  deviceId: string,
  channelId: string,
  isSubStream: boolean = false,
) {
  return http.Get<INationalPlayInfo>(`/api/play/start/${deviceId}/${channelId}`, {
    params: {
      isSubStream,
    },
  })
}

/**
 * 获取拉流设备播放地址
 * @param app 应用名称
 * @param stream 流名称
 * @param mediaServerId 媒体服务器ID
 */
export function getProxyPlayUrl(
  app: string,
  stream: string,
  mediaServerId: string,
) {
  return http.Get<IProxyPlayInfo>('/api/push/getPlayUrl', {
    params: {
      app,
      stream,
      mediaServerId,
    },
  })
}

// ==================== 云台控制相关接口 ====================

/**
 * 云台控制命令枚举
 */
export enum PtzCommand {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
  STOP = 'stop',
  ZOOM_IN = 'zoomin',
  ZOOM_OUT = 'zoomout',
}

/**
 * 统一控制命令枚举 - 合并预置位、巡航、扫描控制命令
 */
export enum ControlCommand {
  // 预置位操作
  PRESET_SET = 129, // 设置预置位
  PRESET_CALL = 130, // 调用预置位
  PRESET_DELETE = 131, // 删除预置位

  // 巡航控制
  CRUISE_ADD_POINT = 132, // 添加巡航点
  CRUISE_DELETE_POINT = 133, // 删除巡航点
  CRUISE_SET_SPEED = 134, // 设置巡航速度
  CRUISE_SET_TIME = 135, // 设置停留时间
  CRUISE_START = 136, // 开始巡航

  // 扫描控制
  SCAN_START = 137, // 开始扫描
  SCAN_SET_SPEED = 138, // 设置扫描速度
  SCAN_LEFT_BOUNDARY = 1, // 设置左边界
  SCAN_RIGHT_BOUNDARY = 2, // 设置右边界
}

/**
 * 统一设备控制函数 - 支持预置位、巡航、扫描控制
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param cmdCode 命令代码
 * @param parameter1 参数1（通常是组编号或其他主要参数）
 * @param parameter2 参数2（通常是预置位编号、速度、时间等）
 * @param combindCode2 组合代码2（用于扩展参数）
 */
export function deviceControl(
  deviceId: string,
  channelId: string,
  cmdCode: ControlCommand,
  parameter1: number = 0,
  parameter2: number = 0,
  combindCode2: number = 0,
) {
  return http.Post<any>(`/api/ptz/front_end_command/${deviceId}/${channelId}`, null, {
    params: {
      cmdCode,
      parameter1,
      parameter2,
      combindCode2,
    },
  })
}

/**
 * 基础云台控制（方向控制和变焦）
 * @param deviceId 设备ID
 * @param channelId 通道ID
 * @param command 控制命令
 * @param speed 控制速度 (0-255)
 */
export function ptzControl(
  deviceId: string,
  channelId: string,
  command: PtzCommand,
  speed: number = 30,
) {
  return http.Post<any>(`/api/ptz/control/${deviceId}/${channelId}`, null, {
    params: {
      command,
      horizonSpeed: speed,
      verticalSpeed: speed,
      zoomSpeed: speed,
    },
  })
}
