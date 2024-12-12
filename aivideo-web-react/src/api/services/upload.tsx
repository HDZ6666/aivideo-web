import apiClient from '../videoApiClient';

export interface TaskInfoReq {
  identifier: string;
}

export interface TaskInfoRes {
  finished: boolean;
  path: string;
  taskRecord: TaskRecordItem;
}

export interface TaskRecordItem {
  id: string;
  uploadId: string;
  fileIdentifier: string;
  fileName: string;
  bucketName: string;
  objectKey: string;
  totalSize: string;
  chunkSize: string;
  chunkNum: number;
  exitPartList: ExitPartItem[];
}

export interface ExitPartItem {
  partNumber: number;
  lastModified: number;
  size: string;
  etag: string;
}

export interface InitTaskReq {
  identifier: string;
  fileName: string;
  totalSize: number;
  chunkSize: number;
  alarmTypeId: number;
}

export type InitTaskRes = TaskInfoRes;

export interface PreSignUrlReq {
  identifier: string;
  partNumber: number;
}

export interface UploadPartReq {
  url: string;
  data: Blob;
}

export interface MergeReq {
  identifier: string;
}

export interface FileListReq {
  page: number;
  pageSize: number;
  fileName?: string;
  alarmTypeId: number;
}

export interface FileListRes {
  total: number;
  list: FileListItem[];
  size: number;
}

export interface FileListItem {
  id: number;
  fileName: string;
  totalSize: number;
  isDelete: number;
  fileUrl: string;
  uploadComplete: number;
  alarmTypeId: string;
  isUse: number;
}

export interface DeleteFileReq {
  id: number;
}

export interface BingAlarmCategoryReq {
  fileId: number;
  alarmTypeId: number;
}

export enum FileUploadApi {
  taskInfo = 'v1/minio/tasks',
  initTask = 'v1/minio/tasks',
  preSignUrl = 'v1/minio/tasks',
  merge = 'v1/minio/tasks/merge',
  fileList = '/v1/minio/tasks/fileList',
  deleteFile = '/v1/minio/tasks/deleteAlarmCategoryFile',
  bingAlarmCategory = '/v1/minio/tasks/bingAlarmCategory',
}
/**
 * 根据文件的md5获取未上传完的任务
 * @param identifier 文件md5
 * @returns {Promise<AxiosResponse<any>>}
 */
const taskInfo = (params: TaskInfoReq) =>
  apiClient.get<TaskInfoRes>({ url: `${FileUploadApi.taskInfo}/${params.identifier}` });

/**
 * 初始化一个分片上传任务
 * @param identifier 文件md5
 * @param fileName 文件名称
 * @param totalSize 文件大小
 * @param chunkSize 分块大小
 * @returns {Promise<AxiosResponse<TaskInfoRes>>}
 */
const initTask = (data: InitTaskReq) =>
  apiClient.post<TaskInfoRes>({ url: FileUploadApi.initTask, data });

/**
 * 获取预签名分片上传地址
 * @param identifier 文件md5
 * @param partNumber 分片编号
 * @returns {Promise<AxiosResponse<any>>}
 */
const preSignUrl = (params: PreSignUrlReq) =>
  apiClient.get<string>({
    url: `${FileUploadApi.preSignUrl}/${params.identifier}/${params.partNumber}`,
  });

/**
 * 合并分片
 * @param identifier
 * @returns {Promise<AxiosResponse<any>>}
 */
const merge = (params: MergeReq) =>
  apiClient.post({ url: `${FileUploadApi.merge}/${params.identifier}` });

/**
 * 上传单文件
 * @param url
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */

const uploadPart = (params: UploadPartReq) =>
  apiClient.put({
    url: params.url,
    data: params.data,
    headers: { 'Content-Type': 'application/octet-stream' },
  });

const fileList = (params: FileListReq) =>
  apiClient.get<FileListRes>({ url: FileUploadApi.fileList, params });

const deleteFile = (params: DeleteFileReq) =>
  apiClient.delete({ url: FileUploadApi.deleteFile, params });

const bingAlarmCategory = (params: BingAlarmCategoryReq) =>
  apiClient.post({ url: FileUploadApi.bingAlarmCategory, params });

export default {
  taskInfo,
  initTask,
  preSignUrl,
  merge,
  uploadPart,
  fileList,
  deleteFile,
  bingAlarmCategory,
};
