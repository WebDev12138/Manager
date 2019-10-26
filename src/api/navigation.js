import request from '@/utils/request'

export function getNav(roleId) {
  return request({
    url: '/navigation/get',
    method: 'get',
    params: { roleId }
  })
}
