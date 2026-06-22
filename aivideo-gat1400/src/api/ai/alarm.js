import { aiRequest } from './request'

export function listAlarm(params) {
  return aiRequest({
    url: '/ai/api/alarm/alarmCameraListAll',
    method: 'get',
    params
  })
}

export function getAlarmDetail(params) {
  return aiRequest({
    url: '/ai/api/alarm/alarmRecordDetail',
    method: 'get',
    params
  })
}

export function handleAlarm(params) {
  return aiRequest({
    url: '/ai/api/alarm/handle',
    method: 'get',
    params
  })
}

export function batchHandleAlarm(data) {
  return aiRequest({
    url: `/ai/api/alarm/batchHandleAlarm?status=${data.status}`,
    method: 'post',
    data: data.alarmIds
  })
}

export function startLiveVideo(params) {
  return aiRequest({
    url: `/api/play/start/${params.national_num}/${params.channel}`,
    method: 'get'
  })
}

