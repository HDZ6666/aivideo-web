import request from '@/utils/request'

// 查询企业监测区标绘列表
export function listMonitor(query) {
  return request({
    url: '/system/monitor/list',
    method: 'get',
    params: query
  })
}

// 查询企业监测区标绘详细
export function getMonitor(id) {
  return request({
    url: '/system/monitor/' + id,
    method: 'get'
  })
}

// 新增企业监测区标绘
export function addMonitor(data) {
  return request({
    url: '/system/monitor',
    method: 'post',
    data: data
  })
}

// 修改企业监测区标绘
export function updateMonitor(data) {
  return request({
    url: '/system/monitor',
    method: 'put',
    data: data
  })
}

// 删除企业监测区标绘
export function delMonitor(id) {
  return request({
    url: '/system/monitor/' + id,
    method: 'delete'
  })
}
