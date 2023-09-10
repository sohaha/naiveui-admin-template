import type { InstApi } from '@/types/global'

export function apiUserList(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get('/manage/account/user', { params })
}

export function apiUserInfo(id: number | string): Promise<InstApi> {
  return apis.get(`/manage/account/user/${id}`)
}

export function apiUserUpdate(id: number | string, data: { [key: string]: any }): Promise<InstApi> {
  return apis.put(`/manage/account/user/${id}`, data)
}

export function apiUserCreare(data: { [key: string]: any }): Promise<InstApi> {
  return apis.post('/manage/account/user', data)
}

export function apiUserDelete(id: number | string): Promise<InstApi> {
  return apis.delete(`/manage/account/user/${id}`)
}

export function apiMenuReset(data: any[]): Promise<InstApi> {
  return apis.put('/manage/account/menu/reset', data)
}

export function apiMenuList(): Promise<InstApi> {
  return apis.get('/manage/account/menu')
}

export function apiRoleList(): Promise<InstApi> {
  return apis.get('/manage/account/role')
}

export function apiRoleCreare(data: { [key: string]: any }): Promise<InstApi> {
  return apis.post('/manage/account/role', data)
}

export function apiRoleUpdate(id: number | string, data: { [key: string]: any }): Promise<InstApi> {
  return apis.put(`/manage/account/role/${id}`, data)
}

export function apiRoleDelete(id: number | string): Promise<InstApi> {
  return apis.delete(`/manage/account/role/${id}`)
}

export function apiSetting(): Promise<InstApi> {
  return apis.get('/manage/setting')
}

export function apiSettingUpdate(data: Record<string, any>[]): Promise<InstApi> {
  return apis.put('/manage/setting', data)
}
