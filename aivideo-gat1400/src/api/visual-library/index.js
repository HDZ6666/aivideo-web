import request from '@/utils/request'

const VIID_PREFIX = '/api/viid'

export function requestVisualLibrary(config) {
  return request(config)
}

export function pageResource(config, params) {
  return request({
    url: config.listUrl || `${VIID_PREFIX}/${config.endpoint}/page`,
    method: 'get',
    params
  })
}

export function tableResource(config, params) {
  return request({
    url: config.listUrl || `${VIID_PREFIX}/${config.endpoint}/table`,
    method: 'get',
    params
  })
}

export function getResource(config, id) {
  return request({
    url: config.getUrl || `${VIID_PREFIX}/${config.endpoint}/${id}`,
    method: 'get'
  })
}

export function saveResource(config, data) {
  return request({
    url: config.saveUrl || `${VIID_PREFIX}/${config.endpoint}${config.saveSuffix || ''}`,
    method: 'post',
    data
  })
}

export function updateResource(config, data) {
  return request({
    url: config.updateUrl || `${VIID_PREFIX}/${config.endpoint}${config.updateSuffix || ''}`,
    method: 'put',
    data
  })
}

export function deleteResource(config, ids) {
  return request({
    url: config.deleteUrl ? `${config.deleteUrl}/${ids}` : `${VIID_PREFIX}/${config.endpoint}/${ids}`,
    method: 'delete'
  })
}

export function customResourceAction(action, row) {
  const id = row[action.idField || 'id']
  return request({
    url: typeof action.url === 'function' ? action.url(row) : action.url,
    method: action.method || 'post',
    params: action.params ? action.params(row) : { id },
    data: action.data ? action.data(row) : undefined
  })
}

export function getSelfInstance() {
  return request({
    url: `${VIID_PREFIX}/instance/self`,
    method: 'get'
  })
}

export function updateSelfInstance(data) {
  return request({
    url: `${VIID_PREFIX}/instance/self`,
    method: 'put',
    data
  })
}

export function getSetting() {
  return request({
    url: `${VIID_PREFIX}/setting`,
    method: 'get'
  })
}

export function saveSetting(data) {
  return request({
    url: `${VIID_PREFIX}/setting`,
    method: 'post',
    data
  })
}

export function getResourceOnlineStat() {
  return request({
    url: `${VIID_PREFIX}/stat/resourceOnline`,
    method: 'get'
  })
}

export function getCollectStat() {
  return request({
    url: `${VIID_PREFIX}/stat/collect`,
    method: 'get'
  })
}

export function getSubscribeStat() {
  return request({
    url: `${VIID_PREFIX}/stat/subscribe`,
    method: 'get'
  })
}

export function getInstanceOptions(params) {
  return request({
    url: `${VIID_PREFIX}/instance/options`,
    method: 'get',
    params
  })
}

export function getDeviceOptions(params) {
  return request({
    url: `${VIID_PREFIX}/device/options`,
    method: 'get',
    params
  })
}

export function getTollgateOptions(params) {
  return request({
    url: `${VIID_PREFIX}/tollgate/options`,
    method: 'get',
    params
  })
}

export function getSubscribeDetailOptions(params) {
  return request({
    url: `${VIID_PREFIX}/subscribe/detail/options`,
    method: 'get',
    params
  })
}
