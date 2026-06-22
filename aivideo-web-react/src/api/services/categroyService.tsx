import apiClient from '../videoApiClient';

export interface BaseListRes {
  total: number;
  size: number;
}

export interface CategoryListReq {
  page: number;
  pageSize: number;
  isUse?: number;
  alarmTypeName?: string;
}

export interface CategoryListRes extends BaseListRes {
  list: CategoryItem[];
}

export interface CategoryItem {
  alarmCategory: string;
  alarmCode: string;
  alarmTypeId: number;
  alarmTypeName: string;
  createTime: string;
  id: number;
  isUse: number;
  updateTime: string;
  fileId: number;
  fileName: string;
}

export interface CategoryAddReq {
  alarmTypeName: string;
  alarmCode: string;
  isUse: number;
}

export interface CategoryEditReq {
  id: number;
  alarmTypeName: string;
  alarmCode: string;
  isUse: number;
}

export interface CategoryDeleteReq {
  id: number;
}

export interface CategoryChangeStatusReq {
  id: number;
  isUse: number;
}

export enum CategroyApi {
  CategoryList = '/ai/api/alarmCategory/getAlarmCategoryList',
  CategoryAdd = '/ai/api/alarmCategory/alarmCategoryAdd',
  CategoryEdit = '/ai/api/alarmCategory/updateAlarmCategory',
  CategoryDelete = '/ai/api/alarmCategory/deleteAlarmCategory',
  CategoryChangeStatus = '/ai/api/alarmCategory/isUseAlarmCategory',
}

// 算法库
const CategoryList = (params: CategoryListReq) =>
  apiClient.get<CategoryListRes>({ url: CategroyApi.CategoryList, params });

const CategoryAdd = (data: CategoryAddReq) =>
  apiClient.post({ url: CategroyApi.CategoryAdd, data });

const CategoryEdit = (data: CategoryEditReq) =>
  apiClient.post({ url: CategroyApi.CategoryEdit, data });

const CategoryDelete = (params: CategoryDeleteReq) =>
  apiClient.delete({ url: CategroyApi.CategoryDelete, params });

const CategoryChangeStatus = (data: CategoryChangeStatusReq) =>
  apiClient.post({ url: CategroyApi.CategoryChangeStatus, data });

export default {
  CategoryList,
  CategoryAdd,
  CategoryEdit,
  CategoryDelete,
  CategoryChangeStatus,
};
