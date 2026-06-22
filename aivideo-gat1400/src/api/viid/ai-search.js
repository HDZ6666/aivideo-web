import request from '@/utils/request'

export function searchFaces(data) {
  return request({
    url: '/api/viid/searchFaces/page',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
