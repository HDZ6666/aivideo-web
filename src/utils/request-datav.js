import axios from 'axios'
import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'

let downloadLoadingInstance

// 硬编码 Token
// 默认 Token（仅作为独立开发/测试时的兜底）
const DEFAULT_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNzk2NDZjNGRiYzQwODM4M2E5ZWVkMDlmMmI4NWFlIn0.eyJqdGkiOiJ0clU0bkdBOG5xUDdrSlF4Y3RHTUpnIiwiaWF0IjoxNzcyMDc2ODE0LCJleHAiOjE3NzQ2Njg4MTQsIm5iZiI6MTc3MjA3NjgxNCwic3ViIjoibG9naW4iLCJhdWQiOiJBdWRpZW5jZSIsInVzZXJOYW1lIjoiYWRtaW4ifQ.101RWRNuiPj6kxQGVPBJb23PndxKRTL1CITcpcAiTtd-tL8zmI944Yv-YjxIR3YdLkxCcQvaI8xiIt7nf8KLmPVqEyVSjrc7T7T3Jr44fTW7Zqg3zT6M4PRI0pdT6TVDVKwdMdlnGi4C6oKlo6k3khu2PCcnq_hfGwUBauYOUJFFPuddigmiT8q-me4kLK9Ons2oR-mZVDZoMbxIdI4z8cPHKESpCcZovUYiEjrUBOjtGOvKfLj62onMRJr4dHDAfofpV_ECAiMlI9XVU5cSf4SYceQXO3f9T2O3RLHYb3jGmZcdtT14VpNZl_mKU3i-n2zOdBwcqY-HFQr6w-zMLw"

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // 根据环境配置文件获取 API 前缀
  baseURL: import.meta.env.VITE_APP_DATAV_API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  
  // 动态获取 Token，优先从 localStorage 读取主应用的 'wvp-token'
  const token = localStorage.getItem('wvp-token')
  if (token) {
    console.log('[DataV] 成功从 localStorage 获取 wvp-token');
  } else {
    console.warn('[DataV] 未发现 wvp-token，使用默认测试 Token');
  }
  config.headers['access-token'] = token || DEFAULT_TOKEN

  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length // 请求数据大小
    const limitSize = 5 * 1024 * 1024 // 限制存放数据5M
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url                // 请求地址
      const s_data = sessionObj.data              // 请求数据
      const s_time = sessionObj.time              // 请求时间
      const interval = 1000                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
      return res.data
    }
    
    // 处理鉴权失效
    if (code === 401) {
      console.warn('[DataV] 接口返回 401，准备向 window.top 发送 unauthorized 信号')
      if (window.top) {
        window.top.dispatchEvent(new CustomEvent("unauthorized"))
        console.log('[DataV] 信号已派发至 window.top')
      } else {
        console.error('[DataV] 无法找到 window.top，信号发送失败')
      }
      return Promise.reject('DataV Token 无效或过期')
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200 && code !== '0') { // 兼容 code 为 string "0" 的情况
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return Promise.resolve(res.data)
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error
    if (message == "Network Error") {
      message = "后端接口连接异常"
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时"
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常"
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

/**
 * 模拟 getApiClient 接口，以兼容 monitor.vue
 * monitor.vue 中使用 const apiClient = getApiClient(); apiClient.GET(...)
 */
export function getApiClient() {
    return {
        GET: (url, params) => service.get(url, { params }),
        POST: (url, data) => service.post(url, data),
        PUT: (url, data) => service.put(url, data),
        DELETE: (url, params) => service.delete(url, { params })
    }
}

export default service
