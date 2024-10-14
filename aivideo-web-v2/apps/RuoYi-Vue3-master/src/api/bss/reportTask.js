import request from '@/utils/request'

// 查询企业活跃度报告任务列表
export function listReportTask(query) {
  return request({
    url: '/bss/reportTask/list',
    method: 'get',
    params: query
  })
}

// 查询企业活跃度报告任务详细
export function getReportTask(id) {
  return request({
    url: '/bss/reportTask/' + id,
    method: 'get'
  })
}

// 新增企业活跃度报告任务
export function addReportTask(data) {
  return request({
    url: '/bss/reportTask',
    method: 'post',
    data: data
  })
}

// 修改企业活跃度报告任务
export function updateReportTask(data) {
  return request({
    url: '/bss/reportTask',
    method: 'put',
    data: data
  })
}

// 删除企业活跃度报告任务
export function delReportTask(id) {
  return request({
    url: '/bss/reportTask/' + id,
    method: 'delete'
  })
}
