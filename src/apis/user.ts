import type { InstApi } from '@/types/global'

export function apiUserList(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get('/manage/user/index', { params })
}

export function apiUserUpdate(id: number | string, data: { [key: string]: any }): Promise<InstApi> {
  return apis.put(`/manage/user/index?id=${id}`, data)
}

export function apiUserCreare(data: { [key: string]: any }): Promise<InstApi> {
  return apis.post('/manage/user/index', data)
}

export function apiUserDelete(id: number | string): Promise<InstApi> {
  return apis.delete(`/manage/user/index?id=${id}`)
}
