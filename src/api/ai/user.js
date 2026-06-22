import { aiRequest } from './request'

export function listPushUser(params) {
  return aiRequest({
    url: '/api/user/users',
    method: 'get',
    params
  })
}

