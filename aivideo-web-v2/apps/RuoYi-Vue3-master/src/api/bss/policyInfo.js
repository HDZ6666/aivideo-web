import request from '@/utils/request'

// 查询企业活跃度政策信息管理列表
export function listPolicyInfo(query) {
  return request({
    url: '/bss/policyInfo/list',
    method: 'get',
    params: query
  })
}

// 查询企业活跃度政策信息管理详细
export function getPolicyInfo(id) {
  return request({
    url: '/bss/policyInfo/' + id,
    method: 'get'
  })
}

// 新增企业活跃度政策信息管理
export function addPolicyInfo(data) {
  return request({
    url: '/bss/policyInfo',
    method: 'post',
    data: data
  })
}

// 修改企业活跃度政策信息管理
export function updatePolicyInfo(data) {
  return request({
    url: '/bss/policyInfo',
    method: 'put',
    data: data
  })
}

// 删除企业活跃度政策信息管理
export function delPolicyInfo(id) {
  return request({
    url: '/bss/policyInfo/' + id,
    method: 'delete'
  })
}
// 查看附件
export function lookDownLoadFile(id){
  return request({
    url: "bss/policyInfo/downloadLocal",
    method: 'get',
    responseType:'blob',
    params:{
      id
    }
  })
}