import apiClient from '../videoApiClient';

export interface DeviceDetailReq {
  deviceID?: string;
  channel?: string;
}

export interface DeviceDetailRes {
  name?: string;
}

export enum VideoApi {
  DeviceDetail = '/api/device/query/devices/',
}

const getDeviceDetail = (params: DeviceDetailReq) =>
  apiClient.get<DeviceDetailRes>({ url: VideoApi.DeviceDetail + params.deviceID });

export default {
  getDeviceDetail,
};
