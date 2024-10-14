import request from '@/utils/request'

// 查询资源项管理列表
export function listResourcesProject(query) {
  return request({
    url: '/bss/resourcesProject/list',
    method: 'get',
    params: query
  })
}

// 查询资源项管理详细
export function getResourcesProject(id) {
  return request({
    url: '/bss/resourcesProject/' + id,
    method: 'get'
  })
}

// 新增资源项管理
export function addResourcesProject(data) {
  return request({
    url: '/bss/resourcesProject',
    method: 'post',
    data: data
  })
}

// 修改资源项管理
export function updateResourcesProject(data) {
  return request({
    url: '/bss/resourcesProject',
    method: 'put',
    data: data
  })
}

// 删除资源项管理
export function delResourcesProject(id) {
  return request({
    url: '/bss/resourcesProject/' + id,
    method: 'delete'
  })
}