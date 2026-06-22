import request from '@/utils/video/request'

export function unwrapResponse(promise) {
  return promise.then((res) => {
    if (res && Object.prototype.hasOwnProperty.call(res, 'data')) {
      return res.data
    }
    return res
  })
}

export function aiRequest(config) {
  return unwrapResponse(request(config))
}
