import request from '@/utils/request'

export function getInstanceOptions(params) {
  return request({
    url: '/api/viid/instance/options',
    method: 'get',
    params
  })
}

export function getDeviceOptions(params) {
  return request({
    url: '/api/viid/device/options',
    method: 'get',
    params
  })
}

export function getSubscribeDetailOptions(params) {
  return request({
    url: '/api/viid/subscribe/detail/options',
    method: 'get',
    params
  })
}

export function getTollgateOptions(params) {
  return request({
    url: '/api/viid/tollgate/options',
    method: 'get',
    params
  })
}

export function getDictOptions(dict) {
  return request({
    url: `/api/viid/gb_dict/${dict}`,
    method: 'get'
  })
}

export function getAllDict() {
  return request({
    url: '/api/viid/gb_dict/all',
    method: 'get'
  })
}
