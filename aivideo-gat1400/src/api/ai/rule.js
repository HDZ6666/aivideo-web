import { aiRequest } from './request'

export function listRule(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/deviceAlarmRuleList',
    method: 'get',
    params
  })
}

export function addRule(data) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/alarmRuleAdd',
    method: 'post',
    data
  })
}

export function updateRule(data) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/updateAlarmRule',
    method: 'post',
    data
  })
}

export function updateDeviceRules(data) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/batchUpdateAlarmSetRules',
    method: 'post',
    data
  })
}

export function deleteRule(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/deleteAlarmRule',
    method: 'delete',
    params
  })
}

export function batchDeleteRule(data) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/batchDeleteAlarmRule',
    method: 'post',
    data
  })
}

export function getRuleDetail(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/alarmRuleDetail',
    method: 'get',
    params
  })
}

export function listRuleDevices(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/allChannelByRuleIdAndAlarmTypeId',
    method: 'get',
    params
  })
}

export function getDeviceSnap(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/snap',
    method: 'get',
    params
  })
}

export function listSnapshot(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/deviceAlarmRuleSnapshotList',
    method: 'get',
    params
  })
}

export function saveSnapshot(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/getFrameSnapshot',
    method: 'get',
    params
  })
}

export function deleteSnapshot(params) {
  return aiRequest({
    url: '/ai/api/ruleAlarm/deleteAlarmRuleSnapshot',
    method: 'delete',
    params
  })
}

