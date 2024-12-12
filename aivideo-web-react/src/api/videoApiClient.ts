import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { t } from '@/locales/i18n';
import userStore from '@/store/userStore';

import { VideoResult } from '#/api';
import { baseApiUrl, ResultEnum } from '#/enum';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: baseApiUrl,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求被发送之前做些什么
    const { accessToken } = userStore.getState().userToken;
    if (accessToken) {
      config.headers['access-token'] = accessToken;
    }
    return config;
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error);
  },
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<VideoResult>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));

    const { code, data, msg } = res.data;
    // 业务请求成功
    const hasSuccess = Reflect.has(res.data, 'code') && code === ResultEnum.SUCCESS;
    if (!hasSuccess) {
      // 业务请求错误
      Message.error(msg);
      throw new Error(msg || t('sys.api.apiRequestFailed'));
    }
    return data;
  },
  (error: AxiosError<VideoResult>) => {
    const { response, message } = error || {};
    const errMsg = response?.data?.msg || message || t('sys.api.errorMessage');
    Message.error(errMsg);

    const status = response?.status;
    if (status === 401) {
      // useUserActions().clearUserInfoAndToken();
      userStore.getState().actions.clearUserInfoAndToken();
      window?.top?.dispatchEvent(new CustomEvent('unauthorized')); // 提醒上层应用重新登录
    }
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<VideoResult>>(config)
        .then((res: AxiosResponse<VideoResult>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();
