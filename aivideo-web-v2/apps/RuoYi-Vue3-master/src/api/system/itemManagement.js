import request from '@/utils/request'

// 查询数据项管理列表
export function listItemManagement(query) {
  return request({
    url: '/system/itemManagement/list',
    method: 'get',
    params: query
  })
}

// 查询数据项管理详细
export function getItemManagement(id) {
  return request({
    url: '/system/itemManagement/' + id,
    method: 'get'
  })
}

// 新增数据项管理
export function addItemManagement(data) {
  return request({
    url: '/system/itemManagement',
    method: 'post',
    data: data
  })
}

// 修改数据项管理
export function updateItemManagement(data) {
  return request({
    url: '/system/itemManagement',
    method: 'put',
    data: data
  })
}

// 删除数据项管理
export function delItemManagement(id) {
  return request({
    url: '/system/itemManagement/' + id,
    method: 'delete'
  })
}
