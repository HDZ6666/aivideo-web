import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import errorCode from '@/utils/errorCode'
import { tansParams } from '@/utils/ruoyi'

// export const VIDEO_API_BASE_URL = 'http://120.237.149.244:13001'
 export const VIDEO_API_BASE_URL = 'http://10.6.8.240:13001' // 市监局


// export const VIDEO_ACCESS_TOKEN =
//   'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNzk2NDZjNGRiYzQwODM4M2E5ZWVkMDlmMmI4NWFlIn0.eyJqdGkiOiJrdTFoYlIyai1yYVdiWV95VEpnckFBIiwiaWF0IjoxNzc3MzQxNTU2LCJleHAiOjE3Nzk5MzM1NTYsIm5iZiI6MTc3NzM0MTU1Niwic3ViIjoibG9naW4iLCJhdWQiOiJBdWRpZW5jZSIsInVzZXJOYW1lIjoiYWRtaW4ifQ.IRrAfhxD2ODhHY_RBhpdUpSltiORYb5eBIMaNf-_N1o_ddR6LPdX5klZkL8fwUch0QfZILa-JfDo0VNWYXqA1nMQfZ7ekR9L_SkwW_tPRtsiEz7aY5-zkM-nktQSNyVSbdzPu1t7bXAtOFvg2-w04me8ypVKLI5LFwpvro5urHaDtRrJum3VJoPOrhsbY_yspidT2oo21AAGqtbGp1Pl9ch_u93_ZZ8V4BiJSrpG5qHRtUD_YhHlU5q_rlx4kVZwGT__2shZdHTPLNrlSF2dRQ9ZGtUrfwILAlRXPc9TeGYNoAY1DkZ07wSvWI3p7_4zCTXVd9yZo_93BoY1yC5CBA'
// 市监局
export const VIDEO_ACCESS_TOKEN =
  ' eyJhbGciOiJSUzI1NiIsImtpZCI6IjNlNzk2NDZjNGRiYzQwODM4M2E5ZWVkMDlmMmI4NWFlIn0.eyJqdGkiOiJ1Mm9mcUQxWmJpenV2ZDhmT0tPblRRIiwiaWF0IjoxNzc4ODI5NDEzLCJleHAiOjE3ODE0MjE0MTMsIm5iZiI6MTc3ODgyOTQxMywic3ViIjoibG9naW4iLCJhdWQiOiJBdWRpZW5jZSIsInVzZXJOYW1lIjoiYWRtaW4ifQ.JgJ1J-Do9Y6EMMcWeufBSTeQcql8VSkdg1I_V95TrgSGxLRV2PxrBh7FqQyhQHBx6vi2sjIiUbwuWGr0-_Fpj-nwsgUzC56rA-fLAdqXJnodGr-h1W7PmkL-Syyp4IZrwqbt1W_P1Q7ehQUM-fgqJ5rbZ1hxHvGBcMWb_kTOXKinXEm4KPhVSb9vqcF6OVqhwKMZOEiMN7rmbR6BxqdKW1-H9gpRxS_1CMezS7ZbdhNaUl4NYKBW2kzu2e7LmldPv0KXbYrt6eN_jLv3_7YFeD2ITSNhWRddr76wGasrGtrDQKiftXoRGAFLpYd9m-nkjw-Soh0kcY0x8SO-iAdvIw'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: VIDEO_API_BASE_URL,
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {}
    config.headers['access-token'] = VIDEO_ACCESS_TOKEN

    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (res) => {
    const code = res.data.code === undefined ? 200 : res.data.code
    const msg = errorCode[code] || res.data.msg || errorCode.default

    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }

    if (code === 401) {
      ElMessage({ message: '视频服务 Token 无效或过期', type: 'error' })
      return Promise.reject(new Error('Video token invalid or expired'))
    }

    if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    }

    if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    }

    if (![0, '0', 200].includes(code)) {
      ElNotification.error({ title: msg })
      return Promise.reject(new Error(msg))
    }

    return res.data
  },
  (error) => {
    let { message } = error

    if (message === 'Network Error') {
      message = '视频服务连接异常'
    } else if (message.includes('timeout')) {
      message = '视频服务请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '视频服务' + message.slice(-3) + '异常'
    }

    ElMessage({ message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default service
