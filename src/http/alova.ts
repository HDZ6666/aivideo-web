import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { useUserStore } from '@/store'
import { toast } from '@/utils/toast'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './enum'

// 配置动态Tag
export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_SERVER_BASEURL,
  SECONDARY: import.meta.env.VITE_API_SECONDARY_URL,
}

/**
 * 创建请求实例
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  refreshTokenOnSuccess: {
    isExpired: (response, method) => {
      return response.statusCode === ResultEnum.Unauthorized
    },
    handler: async (response, method) => {
      useUserStore().clearUserStore()
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/pages/login/index'
      await uni.reLaunch({ url: loginUrl })
      throw new Error('Token已过期，请重新登录')
    },
  },
})

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  ...AdapterUniapp(),
  timeout: 60000,
  cacheFor: null,
  statesHook: VueHook,

  beforeRequest: onAuthRequired((method) => {
    // 设置默认 Content-Type
    method.config.headers = {
      ContentType: ContentTypeEnum.JSON,
      Accept: 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    const { config } = method
    const ignoreAuth = config.meta?.ignoreAuth === true

    // 处理认证信息
    if (!ignoreAuth) {
      const token = useUserStore().token
      if (token) {
        method.config.headers['access-token'] = `${token}`
      }
    }

    // 处理动态域名
    if (config.meta?.domain) {
      method.baseURL = config.meta.domain
      console.log('当前域名', method.baseURL)
    }
  }),

  responded: onResponseRefreshToken({
    onSuccess: (response, method) => {
      console.log('请求成功2', response)
      const { config } = method
      const { requestType } = config
      const {
        statusCode,
        data: rawData,
        errMsg,
      } = response as UniNamespace.RequestSuccessCallbackResult

      // 处理特殊请求类型（上传/下载）
      if (requestType === 'upload' || requestType === 'download') {
        return response
      }

      // 处理 HTTP 状态码错误
      if (statusCode !== 200) {
        const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
        toast.error(errorMessage)
        throw new Error(`${errorMessage}：${errMsg}`)
      }

      // 处理业务逻辑错误
      const { code, msg, data } = rawData as IResponse
      if (code !== ResultEnum.Success) {
        if (config.meta?.toast !== false) {
          toast.error(msg)
        }
        throw new Error(`请求错误[${code}]：${msg}`)
      }
      // 处理成功响应，返回业务数据
      return data
    },
    onError: (error, method) => {
      console.log('请求失败', error)
      throw error
    },
  }),
})

export const http = alovaInstance
