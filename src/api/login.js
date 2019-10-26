import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/managerUser/login',
    params,
    method: 'POST'
  })
}

export function getInfo(token) {
  return request({
    url: '/managerUserInfo/getUserInfo' + '?userId=' + token,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
