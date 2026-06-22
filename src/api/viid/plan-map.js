import request from '@/utils/request'

export function savePlanMap(data) {
  return request({
    url: '/api/viid/tollgate/savePlan',
    method: 'post',
    data
  })
}
