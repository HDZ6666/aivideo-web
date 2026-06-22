import request from '@/utils/video/request'

export function startDevicePlay(deviceId, channelId) {
  return request({
    url: `/api/play/start/${deviceId}/${channelId}`,
    method: 'get'
  })
}

