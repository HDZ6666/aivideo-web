import request from '@/utils/request'

// 查询个人访问情况统计列表
export function listPersonal(query) {
  return request({
    url: '/system/personal/list',
    method: 'get',
    params: query
  })
}

// 查询个人访问情况统计详细
export function getPersonal(id) {
  return request({
    url: '/system/personal/' + id,
    method: 'get'
  })
}

// 新增个人访问情况统计
export function addPersonal(data) {
  return request({
    url: '/system/personal',
    method: 'post',
    data: data
  })
}

// 修改个人访问情况统计
export function updatePersonal(data) {
  return request({
    url: '/system/personal',
    method: 'put',
    data: data
  })
}

// 删除个人访问情况统计
export function delPersonal(id) {
  return request({
    url: '/system/personal/' + id,
    method: 'delete'
  })
}
