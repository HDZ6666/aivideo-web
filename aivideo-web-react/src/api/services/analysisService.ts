import apiClient from '../videoApiClient';

export enum AnalysisApi {
  SystemInfo = '/api/server/system/configInfo', // 获取平台信息
  ServerInfo = '/api/server/system/info', // 获取服务器信息
  NodeInfo = '/api/server/media_server/load', // 获取节点加载信息
  ResourceInfo = '/api/server/resource/info', // 获取设备资源信息
}

const getSystemInfo = () => apiClient.get({ url: AnalysisApi.SystemInfo });
const getServerInfo = () => apiClient.get({ url: AnalysisApi.ServerInfo });
const getNodeInfo = () => apiClient.get({ url: AnalysisApi.NodeInfo });
const getResourceInfo = () => apiClient.get({ url: AnalysisApi.ResourceInfo });

export default {
  getSystemInfo,
  getServerInfo,
  getNodeInfo,
  getResourceInfo,
};
