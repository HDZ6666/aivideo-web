import type { IRecordListRes, IRecordPlayInfo, IRecordSegment } from '@/api/record'

// Mock录像片段数据（根据真实API格式）
const mockRecordSegments: IRecordSegment[] = [
  {
    address: null,
    deviceId: '44060000071327942601',
    endTime: '2025-08-25 09:30:00',
    filePath: null,
    fileSize: '999810601',
    name: '7L0CA4CPAJ3C8C2',
    recorderId: null,
    secrecy: 0,
    startTime: '2025-08-25 08:59:06',
    type: 'time',
  },
  {
    address: null,
    deviceId: '44060000071327942601',
    endTime: '2025-08-25 10:00:00',
    filePath: null,
    fileSize: '972073087',
    name: '7L0CA4CPAJ3C8C2',
    recorderId: null,
    secrecy: 0,
    startTime: '2025-08-25 09:30:00',
    type: 'time',
  },
  {
    address: null,
    deviceId: '44060000071327942601',
    endTime: '2025-08-25 10:01:29',
    filePath: null,
    fileSize: '48207666',
    name: '7L0CA4CPAJ3C8C2',
    recorderId: null,
    secrecy: 0,
    startTime: '2025-08-25 10:00:00',
    type: 'time',
  },
  {
    address: null,
    deviceId: '44060000071327942601',
    endTime: '2025-08-25 10:01:47',
    filePath: null,
    fileSize: '9702581',
    name: '7L0CA4CPAJ3C8C2',
    recorderId: null,
    secrecy: 0,
    startTime: '2025-08-25 10:01:29',
    type: 'alarm',
  },
  {
    address: null,
    deviceId: '44060000071327942601',
    endTime: '2025-08-25 10:02:04',
    filePath: null,
    fileSize: '9229849',
    name: '7L0CA4CPAJ3C8C2',
    recorderId: null,
    secrecy: 0,
    startTime: '2025-08-25 10:01:47',
    type: 'time',
  },
  {
    address: null,
    deviceId: '44060000071327942601',
    endTime: '2025-08-25 10:02:20',
    filePath: null,
    fileSize: '8506284',
    name: '7L0CA4CPAJ3C8C2',
    recorderId: null,
    secrecy: 0,
    startTime: '2025-08-25 10:02:04',
    type: 'alarm',
  },
]

/**
 * Mock获取国标设备录像列表
 */
export async function mockGetNationalRecordList(
  deviceId: string,
  channelId: string,
  startTime: string,
  endTime: string,
): Promise<IRecordListRes> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  // 根据设备ID和通道ID过滤录像
  const filteredRecords = mockRecordSegments

  return {
    channelId,
    count: filteredRecords.length,
    deviceId,
    lastTime: null,
    name: '7L0CA4CPAJ3C8C2',
    recordList: filteredRecords,
    sn: '951890',
    sumNum: filteredRecords.length,
  }
}

/**
 * Mock获取录像播放地址
 */
export async function mockGetRecordPlayUrl(
  deviceId: string,
  channelId: string,
  startTime: string,
  endTime: string,
): Promise<IRecordPlayInfo> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const app = 'rtp'
  const formattedStartTime = startTime.replace(/[-:\s]/g, '').substring(0, 14)
  const formattedEndTime = endTime.replace(/[-:\s]/g, '').substring(0, 14)
  const stream = `${deviceId}_${channelId}_${formattedStartTime}_${formattedEndTime}`

  return {
    app,
    downLoadFilePath: null,
    endTime,
    flv: `http://192.168.17.161:20001/${app}/${stream}.live.flv`,
    fmp4: `http://192.168.17.161:20001/${app}/${stream}.live.mp4`,
    hls: `http://192.168.17.161:20001/${app}/${stream}/hls.m3u8`,
    https_flv: `https://192.168.17.161:20002/${app}/${stream}.live.flv`,
    https_fmp4: `https://192.168.17.161:20002/${app}/${stream}.live.mp4`,
    https_hls: `https://192.168.17.161:20002/${app}/${stream}/hls.m3u8`,
    https_ts: `https://192.168.17.161:20002/${app}/${stream}.live.ts`,
    ip: null,
    mediaServerId: 'eykTbQSHElebnl98',
    progress: 0,
    rtc: `http://192.168.17.161:20001/index/api/webrtc?app=${app}&stream=${stream}&type=play`,
    rtcs: `https://192.168.17.161:20002/index/api/webrtc?app=${app}&stream=${stream}&type=play`,
    rtmp: `rtmp://192.168.17.161:1935/${app}/${stream}`,
    rtmps: null,
    rtsp: `rtsp://192.168.17.161:554/${app}/${stream}`,
    rtsps: null,
    startTime,
    stream,
    tracks: [
      {
        channels: 0,
        codec_id: 0,
        codec_id_name: 'H264',
        codec_type: 0,
        fps: 25,
        frames: 2,
        gop_interval_ms: 0,
        gop_size: 1,
        height: 1080,
        key_frames: 2,
        loss: -1,
        ready: true,
        sample_bit: 0,
        sample_rate: 0,
        width: 1920,
      },
    ],
    ts: `http://192.168.17.161:20001/${app}/${stream}.live.ts`,
    ws_flv: `ws://192.168.17.161:20001/${app}/${stream}.live.flv`,
    ws_fmp4: `ws://192.168.17.161:20001/${app}/${stream}.live.mp4`,
    ws_hls: `ws://192.168.17.161:20001/${app}/${stream}/hls.m3u8`,
    ws_ts: `ws://192.168.17.161:20001/${app}/${stream}.live.ts`,
    wss_flv: `wss://192.168.17.161:20002/${app}/${stream}.live.flv`,
    wss_fmp4: `wss://192.168.17.161:20002/${app}/${stream}.live.mp4`,
    wss_hls: `wss://192.168.17.161:20002/${app}/${stream}/hls.m3u8`,
    wss_ts: null,
  }
}
