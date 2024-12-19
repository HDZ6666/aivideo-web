import { DeviceType } from '@/components/device-select/device-modal';
import { KonvasFormType } from '@/components/konvas/interface';
import { IDayForm } from '@/components/time-line/interface';
import { UserType } from '@/components/user-select/user-modal';

import apiClient from '../videoApiClient';

/* **********************************告警列表**************************************************** */
export interface AlarmListReq {
  page: number;
  pageSize: number;
  deviceName?: string;
  status?: number;
  alarm_type_name?: string;
  startTime?: string;
  endTime?: string;
}

export interface AlarmListItem {
  id: number;
  deviceName?: string;
  modelname?: string;
  alarmTypeId?: number;
  status: number;
  alarmImg?: string;
  createTime: string;
  alarmTime: string;
}

export interface AlarmListRes {
  list: AlarmListItem[];
  total: number;
  size: number;
}

export interface AlarmDetailReq {
  alarm_id: number;
}

export interface AlarmDetailRes {
  alarm_id: number;
  status: number;
  alarm_img?: string;
  modelname?: string;
  device_name?: string;
  alarm_time: string;
  detail?: AlarmDetailchannel;
  address?: string;
  notice_type?: string;
  notice_unames?: string[];
  videoUrl?: string;
}

export interface AlarmDetailchannel {
  national_num?: string;
  channel?: string;
}

export interface AlarmStatusReq {
  alarmId: number;
  status: number;
}

export interface AlarmCategoryReq {
  page: number;
  pageSize: number;
  query?: string;
}

export interface AlarmCategoryItem {
  alarmTypeName: string;
  alarmCode: string;
  id: number;
  alarmTypeId: number;
  updateTime: string;
  createTime: string;
  status: boolean;
}

export interface AlarmCategoryRes {
  list: AlarmCategoryItem[];
  total: number;
  size: number;
}

export interface BatchUpdateAlarmStatusReq {
  alarmIds: number[];
  status: number;
}

/* **********************************告警配置**************************************************** */

// 规则类型
export interface RuleItem {
  engine: string;
  device: DeviceItem[];
  notificateType: string[];
  notificatePeople: UserType[];
  timelines: IDayForm[];
  spiltTime: number;
  alarmTime: number;
  confidence: number;
  alarmTypeId: string;
  id: number;
  areaSet: string;
  imgLink: string;
  imgLinkKuaizhao: string;
}
// 获取规则列表
export interface GetRuleListByAlarmTypeReq {
  alarmTypeId?: string;
  page: number;
  pageSize: number;
  query?: string;
}

export interface GetRuleListByAlarmTypeRes {
  list: RuleItem[];
  total: number;
  size: number;
}

// 新增规则
export interface AddRuleByAlarmTypeReq {
  engine: string;
  device: DeviceType[];
  notificateType: string[];
  notificatePeople: UserType[];
  timelines: IDayForm[];
  spiltTime: number;
  alarmTime: number;
  confidence: number;
  alarmTypeId: string;
  areaSet: KonvasFormType;
}

// 更新单个摄像头的规则
export interface UpdateRuleByAlarmTypeReq extends AddRuleByAlarmTypeReq {
  ruleId: number;
}

// 删除规则
export interface DeteleRuleByAlarmTypeReq {
  ruleId: number;
}
// 删除规则
// export interface BatchDeteleRuleReq {
//   ruleIds: number[];
// }

// 批量更新单个摄像头的规则
export interface UpdateRuleByDeviceReq extends UpdateRuleByAlarmTypeReq {
  ruleIds: number[];
}

// 获取规则详情
export interface GetRuleDetailReq {
  ruleId: number;
  deviceId?: string;
  channelId?: string;
}

export type GetRuleDetailRes = RuleItem;

// 获取设备列表
export interface DeviceListByAlarmTyeReq {
  alarmTypeId?: string;
  page: number;
  pageSize: number;
  query?: string;
  isBing?: number;
}

export interface DeviceListByAlarmTyeRes {
  list: DeviceItem[];
  total: number;
  size: number;
}

export interface DeviceItem {
  id: number;
  name: string;
  deviceId: string;
  channelId: string;
}

export interface GetDeviceSnapReq {
  deviceId?: string;
  channelId?: string;
}

export interface GetSnapshotListReq {
  page: number;
  pageSize: number;
  deviceId?: string;
  channelId?: string;
}

export interface GetSnapshotListRes {
  list: SnapshotItem[];
  total: number;
  size: number;
}

export interface SnapshotItem {
  id: number;
  uid: number;
  name: string;
  status: string;
  imgLink: string;
  createdAt: string;
  alarmImg: string;
}

export interface SnapshotDeleteReq {
  id: number;
}

// export interface GetDeviceSnapRes {
//   url: string;
// }

export enum AiApi {
  // 告警
  AlarmList = '/ai/api/alarm/alarmCameraListAll',
  AlarmDetailByID = '/ai/api/alarm/alarmRecordDetail',
  AlarmStatusByID = '/ai/api/alarm/handle',
  AlarmCategory = '/ai/api/ruleAlarm/getAlarmCategory',
  BatchUpdateAlarmStatus = '/ai/api/alarm/batchHandleAlarm',
  // 规则

  GetRuleListByAlarmType = '/ai/api/ruleAlarm/deviceAlarmRuleList',
  AddRuleByAlarmType = '/ai/api/ruleAlarm/alarmRuleAdd',
  UpdateRuleByAlarmType = '/ai/api/ruleAlarm/updateAlarmRule',
  UpdateRuleByDevice = '/ai/api/ruleAlarm/batchUpdateAlarmSetRules',
  DeleteRuleByAlarmType = '/ai/api/ruleAlarm/deleteAlarmRule',
  BatchDeleteRule = '/ai/api/ruleAlarm/batchDeleteAlarmRule',
  GetRuleDetail = '/ai/api/ruleAlarm/alarmRuleDetail',
  // DeviceListByAlarmTye = '/ai/api/device/query/alarmCategoryChannelListInAll',
  // DeviceListByAlarmTye = '/ai/api/device/query/cameraList',
  DeviceListByAlarmTye = '/ai/api/ruleAlarm/allChannelByRuleIdAndAlarmTypeId',
  DeviceSnap = '/ai/api/ruleAlarm/snap',
  SnapshotList = '/ai/api/ruleAlarm/deviceAlarmRuleSnapshotList',
  SnapshotSave = '/ai/api/ruleAlarm/getFrameSnapshot',
  SnapshotDelete = '/ai/api/ruleAlarm/deleteAlarmRuleSnapshot',
}

const getAlarmList = (params: AlarmListReq) =>
  apiClient.get<AlarmListRes>({ url: AiApi.AlarmList, params });

const getAlarmDetailByID = (params: AlarmDetailReq) =>
  apiClient.get<AlarmDetailRes>({ url: AiApi.AlarmDetailByID, params });

const updateAlarmStatusByID = (params: AlarmStatusReq) =>
  apiClient.get<any>({ url: AiApi.AlarmStatusByID, params });

const BatchUpdateAlarmStatus = (data: BatchUpdateAlarmStatusReq) =>
  apiClient.post({
    url: `${AiApi.BatchUpdateAlarmStatus}?status=${data.status}`,
    data: data.alarmIds,
  });

const getAlarmCategory = (params: AlarmCategoryReq) =>
  apiClient.get<AlarmCategoryRes>({ url: AiApi.AlarmCategory, params });

const getRuleListByAlarmType = (params: GetRuleListByAlarmTypeReq) =>
  apiClient.get<GetRuleListByAlarmTypeRes>({ url: AiApi.GetRuleListByAlarmType, params });

const addRuleByAlarmType = (data: AddRuleByAlarmTypeReq) =>
  apiClient.post({ url: AiApi.AddRuleByAlarmType, data });

const updateRuleByAlarmType = (data: UpdateRuleByAlarmTypeReq) =>
  apiClient.post({ url: AiApi.UpdateRuleByAlarmType, data });

const deteleRuleByAlarmType = (params: DeteleRuleByAlarmTypeReq) =>
  apiClient.delete({ url: AiApi.DeleteRuleByAlarmType, params });

const batchdeteleRule = (data: number[]) => apiClient.post({ url: AiApi.BatchDeleteRule, data });

const updateRuleByDevice = (data: UpdateRuleByDeviceReq) =>
  apiClient.post({ url: AiApi.UpdateRuleByDevice, data });

const getRuleDetail = (params: GetRuleDetailReq) =>
  apiClient.get<GetRuleDetailRes>({ url: AiApi.GetRuleDetail, params });

const getDeviceListByAlarmTye = (params: DeviceListByAlarmTyeReq) =>
  apiClient.get<DeviceListByAlarmTyeRes>({ url: AiApi.DeviceListByAlarmTye, params });

const getDeviceSnap = (params: GetDeviceSnapReq) =>
  apiClient.get({ url: AiApi.DeviceSnap, params });

const getSnapshotList = (params: GetSnapshotListReq) =>
  apiClient.get<GetSnapshotListRes>({ url: AiApi.SnapshotList, params });

const getSnapshotSave = (params: GetDeviceSnapReq) =>
  apiClient.get({ url: AiApi.SnapshotSave, params });

const snapshotDelete = (params: SnapshotDeleteReq) =>
  apiClient.delete({ url: AiApi.SnapshotDelete, params });

export default {
  getAlarmList,
  getAlarmDetailByID,
  updateAlarmStatusByID,
  getAlarmCategory,
  BatchUpdateAlarmStatus,
  getRuleDetail,
  addRuleByAlarmType,
  updateRuleByAlarmType,
  deteleRuleByAlarmType,
  batchdeteleRule,
  updateRuleByDevice,
  getRuleListByAlarmType,
  getDeviceListByAlarmTye,
  getDeviceSnap,
  getSnapshotList,
  getSnapshotSave,
  snapshotDelete,
};
