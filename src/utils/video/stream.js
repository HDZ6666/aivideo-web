const NORMAL_STREAM_KEYS = ['ws_flv', 'WS_FLV', 'flv', 'http_flv', 'fmp4', 'hls', 'rtc', 'rtmp', 'rtsp']
const SECURE_STREAM_KEYS = ['wss_flv', 'WSS_FLV', 'https_flv', 'https_fmp4', 'https_hls', 'rtcs', 'rtmps', 'rtsps']

export function isSuccessResponse(res) {
  const code = res?.code
  return code === 0 || code === '0' || code === 200 || code === '200'
}

export function pickStreamUrl(streamInfo) {
  if (!streamInfo) return ''

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const preferredKeys = isHttps ? SECURE_STREAM_KEYS : NORMAL_STREAM_KEYS
  const fallbackKeys = isHttps ? NORMAL_STREAM_KEYS : SECURE_STREAM_KEYS

  for (const key of preferredKeys) {
    if (streamInfo[key]?.url) return streamInfo[key].url
    if (streamInfo[key]) return streamInfo[key]
  }

  for (const key of fallbackKeys) {
    if (streamInfo[key]?.url) return streamInfo[key].url
    if (streamInfo[key]) return streamInfo[key]
  }

  return ''
}

export function pickPlayStartUrl(playData) {
  if (!playData) return ''
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
  return isHttps
    ? playData.wss_flv || playData.ws_flv || playData.WSS_FLV || playData.WS_FLV || ''
    : playData.ws_flv || playData.wss_flv || playData.WS_FLV || playData.WSS_FLV || ''
}

export function getNodeBusinessData(nodeData) {
  return nodeData?.userData || nodeData || {}
}

