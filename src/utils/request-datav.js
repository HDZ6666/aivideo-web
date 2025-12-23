import axios from 'axios'
import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'

let downloadLoadingInstance

// 硬编码 Token
const TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNzk2NDZjNGRiYzQwODM4M2E5ZWVkMDlmMmI4NWFlIn0.eyJqdGkiOiIydnQ0ODVKRXRtaHhTT3kxNy1qdnRBIiwiaWF0IjoxNzY1MjQ3MzAyLCJleHAiOjE3Njc4MzkzMDIsIm5iZiI6MTc2NTI0NzMwMiwic3ViIjoibG9naW4iLCJhdWQiOiJBdWRpZW5jZSIsInVzZXJOYW1lIjoiYWRtaW4ifQ.Blzs4aivgzeiXbgbj_hn79KuJ6CJUUidwwY25Xna-7PZSa68ejl_Er1GbV-Kc6MVRW9tTpT9G0l6yFLFcqFe9j5X_1BJ-kQX1C1ELBSEVqwXcM2c3ra_24WYeKzgodW026Kj8Lgq6ckndKrwCqml3mrFvhBV-IfUv5jf5uZmO67ijpp6ikbyYmb49c3qvNt20vxhBKhmCVnYMBH_3QvlH1U00qkkFRoD9wJ_EQqh5zyZz4Tx3tGmeQlYxZSTNqzXO9w4VhSMKU0i0kPnptqFOz5RMPB4QhJdPK3WQswmDiyYFqN_lSrM5aGeafivYJcxRPi7g7wQ9u7T7UZXruqhQQ"

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '/datav-api',
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  
  // 设置写死的 Token
  config.headers['access-token'] = TOKEN

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
    
    // 如果是 401 也不要跳出，因为这是 DataV 的特定接口
    if (code === 401) {
      console.error('DataV Token 无效或过期')
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
