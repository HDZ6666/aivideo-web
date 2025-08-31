import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { getToken, setToken } from '@/utils/auth'
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
      const loginUrl = import.meta.env.VITE_LOGIN_URL || '/pages/login/index'
      console.log('Token已过期，请重新登录', loginUrl)

      // 清除本地存储的 token
      setToken('')

      // 清除 Store 中的用户状态
      // 动态导入避免循环依赖
      const { useUserStore } = await import('@/store/user')
      const userStore = useUserStore()
      userStore.clearUserStore()

      await uni.reLaunch({ url: loginUrl })
      throw new Error('Token已过期，请重新登录')
    },
  },

  // uniapp 的适配器不进去这里
  // refreshTokenOnError: {
  //   isExpired: (error) => {
  //     console.log('请求失败1', error)
  //     return error.response?.status === ResultEnum.Unauthorized
  //   },
  //   handler: async () => {
  //     try {
  //       console.log('请求失败2')
  //       // TODO: 实现刷新token逻辑
  //       throw new Error('Token已过期，请重新登录')
  //     }
  //     catch (error) {
  //       console.error('刷新Token失败:', error)
  //       // 切换到登录页
  //       const loginUrl = import.meta.env.VITE_LOGIN_URL || '/pages/login/index'
  //       await uni.reLaunch({ url: loginUrl })
  //       throw error
  //     }
  //   },
  // },
})

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  ...AdapterUniapp(),
  timeout: 5000,
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
      const token = getToken()
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
      const { code, message, data } = rawData as IResponse
      if (code !== ResultEnum.Success) {
        if (config.meta?.toast !== false) {
          toast.warning(message)
        }
        throw new Error(`请求错误[${code}]：${message}`)
      }
      // 处理成功响应，返回业务数据
      return data
    },
    onError: (error, method) => {
      throw error
    },
  }),
})

export const http = alovaInstance
