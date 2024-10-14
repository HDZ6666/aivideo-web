import request from '@/utils/request'

// 查询企业分类数据列表
export function listClassificationData(query) {
  return request({
    url: '/system/classificationData/list',
    method: 'get',
    params: query
  })
}

// 查询企业分类数据详细
export function getClassificationData(id) {
  return request({
    url: '/system/classificationData/' + id,
    method: 'get'
  })
}

// 新增企业分类数据
export function addClassificationData(data) {
  return request({
    url: '/system/classificationData',
    method: 'post',
    data: data
  })
}

// 修改企业分类数据
export function updateClassificationData(data) {
  return request({
    url: '/system/classificationData',
    method: 'put',
    data: data
  })
}

// 删除企业分类数据
export function delClassificationData(id) {
  return request({
    url: '/system/classificationData/' + id,
    method: 'delete'
  })
}
// 获取模板
export function getTemplate(){
  return request({
    url:"/system/classificationData/importTemplate",
    method:"post",
    responseType: 'blob',
  })
}
// 导入数据
export function importData(data){
  return request({
    url:"/system/classificationData/importData",
    method:'post',
    params:{
      updateSupport:0
    },
    data,
    headers:{
      "Content-Type":"multipart/form-data;charset=UTF-8"
    }
  })
}