import { aiRequest } from './request'

export function listCategory(params) {
  return aiRequest({
    url: '/ai/api/alarmCategory/getAlarmCategoryList',
    method: 'get',
    params
  })
}

export function addCategory(data) {
  return aiRequest({
    url: '/ai/api/alarmCategory/alarmCategoryAdd',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return aiRequest({
    url: '/ai/api/alarmCategory/updateAlarmCategory',
    method: 'post',
    data
  })
}

export function deleteCategory(params) {
  return aiRequest({
    url: '/ai/api/alarmCategory/deleteAlarmCategory',
    method: 'delete',
    params
  })
}

export function changeCategoryStatus(data) {
  return aiRequest({
    url: '/ai/api/alarmCategory/isUseAlarmCategory',
    method: 'post',
    data
  })
}

