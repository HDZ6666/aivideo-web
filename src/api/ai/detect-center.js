import { aiRequest } from './request'

export function listDetectModels(params) {
  return aiRequest({
    url: '/ai/api/model/list',
    method: 'get',
    params
  })
}

export function detectMedia(data, options = {}) {
  return aiRequest({
    url: options.url || '/ai/api/model/detect',
    method: 'post',
    data,
    timeout: options.timeout || 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
