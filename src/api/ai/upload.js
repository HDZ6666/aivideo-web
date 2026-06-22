import { aiRequest } from './request'

export function getTaskInfo(params) {
  return aiRequest({
    url: `/v1/minio/tasks/${params.alarmTypeId}/${params.identifier}`,
    method: 'get'
  })
}

export function initTask(data) {
  return aiRequest({
    url: '/v1/minio/tasks',
    method: 'post',
    data
  })
}

export function getPreSignUrl(params) {
  return aiRequest({
    url: `/v1/minio/tasks/${params.alarmTypeId}/${params.identifier}/${params.partNumber}`,
    method: 'get'
  })
}

export function mergeTask(params) {
  return aiRequest({
    url: `/v1/minio/tasks/merge/${params.alarmTypeId}/${params.identifier}`,
    method: 'post'
  })
}

export function listFile(params) {
  return aiRequest({
    url: '/v1/minio/tasks/fileList',
    method: 'get',
    params
  })
}

export function deleteFile(params) {
  return aiRequest({
    url: '/v1/minio/tasks/deleteAlarmCategoryFile',
    method: 'delete',
    params
  })
}

export function bindAlarmCategory(params) {
  return aiRequest({
    url: '/v1/minio/tasks/bingAlarmCategory',
    method: 'post',
    params
  })
}

