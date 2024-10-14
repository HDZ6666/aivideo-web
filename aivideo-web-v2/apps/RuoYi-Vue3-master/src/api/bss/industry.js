import request from '@/utils/request'

// 查询⾏业访问情况统计列表
export function listIndustry(query) {
  return request({
    url: '/system/industry/list',
    method: 'get',
    params: query
  })
}

// 查询⾏业访问情况统计详细
export function getIndustry(id) {
  return request({
    url: '/system/industry/' + id,
    method: 'get'
  })
}

// 新增⾏业访问情况统计
export function addIndustry(data) {
  return request({
    url: '/system/industry',
    method: 'post',
    data: data
  })
}

// 修改⾏业访问情况统计
export function updateIndustry(data) {
  return request({
    url: '/system/industry',
    method: 'put',
    data: data
  })
}

// 删除⾏业访问情况统计
export function delIndustry(id) {
  return request({
    url: '/system/industry/' + id,
    method: 'delete'
  })
}
