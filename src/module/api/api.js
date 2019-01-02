import request from './request'

export function getAward() {
  return request({
    url: '/award',
    method: 'get'
  })
}

export function getUsers() {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function getUserAward() {
  return request({
    url: '/award/users',
    method: 'get'
  })
}

export function getLottery(awardId, stop) {
  return request({
    url: '/lottery',
    method: 'get',
    params: {
      awardId,
      stop,
      count: 3
    }
  })
}

export function uploadImage(data) {
  const formData = new FormData()
  formData.append('file', data)
  const req = request({
    url: '/api/image/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  })
  return req
}

// export function uploadVideo(data) {
//   const formData = new FormData()
//   formData.append('file', data)
//   const req = request({
//     url: '/api/video/upload',
//     method: 'post',
//     headers: { 'Content-Type': 'multipart/form-data' },
//     data: formData
//   })
//   return req
// }


