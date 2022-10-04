import type { InstApi } from '@/types/global'

export function apiUserList(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return api.get('/manage/user/index', { params })
}

export function apiUserUpdate(id: number | string, data: { [key: string]: any }): Promise<InstApi> {
  return api.put(`/manage/user/index?id=${id}`, data)
}

export function apiUserCreare(data: { [key: string]: any }): Promise<InstApi> {
  return api.post('/manage/user/index', data)
}

export function apiUserDelete(id: number | string): Promise<InstApi> {
  return api.delete(`/manage/user/index?id=${id}`)
}
