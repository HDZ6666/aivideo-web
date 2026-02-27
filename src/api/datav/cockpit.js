import request from '@/utils/request-datav'

// 鑾峰彇椹鹃┒鑸变唬鐞嗗垪琛?
// 浣滅敤锛氳幏鍙栭┚椹惰埍浠ｇ悊鍒楄〃锛岃嫢渚濈殑鍝嶅簲鏍煎紡涓猴細{ code: 200, rows: [], total: 0 }
// 璇锋眰鏂瑰紡锛歡et
// 璇锋眰鍙傛暟锛歲uery
// 杩斿洖鍊硷細Promise<any>
// 浣跨敤鏂瑰紡锛歡etCockpitProxyList(query).then(res => {
//   console.log(res)
// })鍚戞湇鍔″櫒鍙戦€佷竴涓狦ET璇锋眰锛屽湴鍧€鏄?/cockpit/proxy/list锛屽弬鏁版槸 query 瀵硅薄锛堜緥濡?{ pageNum: 1, pageSize: 10 }锛?
export function getCockpitProxyList(query) {
  return request({
    url: '/cockpit/proxy/list',
    method: 'get',
    params: query
  })
}

// 鑾峰彇椹鹃┒鑸辫祫婧愪俊鎭?

export function getCockpitResourceInfo() {
  return request({
    url: '/cockpit/proxy/resource/info',
    method: 'get'
  })
}

// 鑾峰彇璁惧鍒嗙粍鍒楄〃
export function getDeviceGroupList(query) {
  return request({
    url: '/ai/api/device/group/cameraGroupList',
    method: 'get',
    params: query
  })
}

// 鏌ヨ璁惧鍜屾祦淇℃伅
export function queryDevicesAndStreams(query) {
  return request({
    url: '/device/query/devices-and-streams',
    method: 'get',
    params: query
  })
}

// 鑾峰彇璁惧淇℃伅缁熻
export function getDeviceInfoCount() {
  return request({
    url: '/alarm/v2/deviceInfo/deviceCount',
    method: 'get'
  })
}

// 鑾峰彇鍦ㄧ嚎璁惧鏁伴噺
export function getOnlineDeviceCount() {
  return request({
    url: '/alarm/v2/deviceInfo/onlineDeviceCount',
    method: 'get'
  })
}

// 鑾峰彇鍛婅淇℃伅鍒嗛〉
export function findAlarmInfoPage(query) {
  return request({
    url: '/alarm/v2/stat/findAlarmInfoPage',
    method: 'get',
    params: query
  })
}

// 鎸夋椂闂寸粺璁″憡璀︽暟閲?
export function statAlarmCountByTime(query) {
  return request({
    url: '/alarm/v2/stat/statAlarmCountByTime',
    method: 'get',
    params: query
  })
}

// 鑾峰彇澶у睆鍛婅缁熻
export function getScreenAlarmStatistics() {
  return request({
    url: '/alarm/v2/stat/screenAlarmStatistics',
    method: 'get'
  })
}

// 鑾峰彇妯″瀷璁剧疆鍒楄〃
export function getModelSettingsList(query) {
  return request({
    url: '/modelSettings/list',
    method: 'get',
    params: query
  })
}

// 鑾峰彇鎽勫儚澶村垪琛紙鐢ㄤ簬鍦板浘鏍囪锛?
export function getCameraListAlgorithm(params) {
  return request({
    url: '/ai/api/device/query/cameraListAlgorithm',
    method: 'get',
    params
  })
}

// 鑾峰彇璁惧绠楁硶璇︽儏锛堢敤浜庡憡璀﹀脊绐楋級
export function getDeviceAlgorithmDetail(params) {
  return request({
    url: '/ai/api/device/query/deviceAlgorithmDetail',
    method: 'get',
    params
  })
}

// 获取摄像头告警列表（用于弹窗告警列表 Tab）
export function getAlarmCameraListAll(params) {
  return request({
    url: '/ai/api/alarm/alarmCameraListAll',
    method: 'get',
    params
  })
}



