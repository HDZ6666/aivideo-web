import request from '@/utils/request'

// 查询用户综合查询列表
export function listComprehensive(query) {
  return request({
    url: '/system/comprehensive/list',
    method: 'get',
    params: query
  })
}

// 查询用户综合查询详细
export function getComprehensive(userId) {
  return request({
    url: '/system/comprehensive/' + userId,
    method: 'get'
  })
}

// 新增用户综合查询
export function addComprehensive(data) {
  return request({
    url: '/system/comprehensive',
    method: 'post',
    data: data
  })
}

// 修改用户综合查询
export function updateComprehensive(data) {
  return request({
    url: '/system/comprehensive',
    method: 'put',
    data: data
  })
}

// 删除用户综合查询
export function delComprehensive(userId) {
  return request({
    url: '/system/comprehensive/' + userId,
    method: 'delete'
  })
}
