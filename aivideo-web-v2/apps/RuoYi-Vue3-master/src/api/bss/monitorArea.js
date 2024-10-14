import request from '@/utils/request'

// 查询企业监测区标绘列表
export function listMonitorArea(query) {
  return request({
    url: '/bss/monitorArea/list',
    method: 'get',
    params: query
  })
}

// 查询企业监测区标绘详细
export function getMonitorArea(id) {
  return request({
    url: '/bss/monitorArea/' + id,
    method: 'get'
  })
}

// 新增企业监测区标绘
export function addMonitorArea(data) {
  return request({
    url: '/bss/monitorArea',
    method: 'post',
    data: data
  })
}

// 修改企业监测区标绘
export function updateMonitorArea(data) {
  return request({
    url: '/bss/monitorArea',
    method: 'put',
    data: data
  })
}

// 删除企业监测区标绘
export function delMonitorArea(id) {
  return request({
    url: '/bss/monitorArea/' + id,
    method: 'delete'
  })
}
