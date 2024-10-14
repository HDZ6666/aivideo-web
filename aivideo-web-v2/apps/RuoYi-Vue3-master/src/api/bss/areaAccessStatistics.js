import request from '@/utils/request'

// 查询企业活跃度区域访问情况统计列表
export function listAreaAccessStatistics(query) {
  return request({
    url: '/bss/areaAccessStatistics/list',
    method: 'get',
    params: query
  })
}

// 查询企业活跃度区域访问情况统计详细
export function getAreaAccessStatistics(id) {
  return request({
    url: '/bss/areaAccessStatistics/' + id,
    method: 'get'
  })
}

// 新增企业活跃度区域访问情况统计
export function addAreaAccessStatistics(data) {
  return request({
    url: '/bss/areaAccessStatistics',
    method: 'post',
    data: data
  })
}

// 修改企业活跃度区域访问情况统计
export function updateAreaAccessStatistics(data) {
  return request({
    url: '/bss/areaAccessStatistics',
    method: 'put',
    data: data
  })
}

// 删除企业活跃度区域访问情况统计
export function delAreaAccessStatistics(id) {
  return request({
    url: '/bss/areaAccessStatistics/' + id,
    method: 'delete'
  })
}
