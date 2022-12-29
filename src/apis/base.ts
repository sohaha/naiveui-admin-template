import settings from '@/settings.json'
import type { InstApi } from '@/types/global'

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export function apiLogin(username: string, password: string): Promise<InstApi> {
  return apis.post('/manage/base/login', { username, password })
}

/**
 * 退出
 */
export function apiLogout(): Promise<InstApi> {
  return apis.post('/manage/base/logout')
}

/**
 * 当前用户信息
 */
export function apiMe(): Promise<InstApi> {
  return apis.get('/manage/base/me')
}

/**
 * 心跳
 */
export function apiHeartbeat(): Promise<InstApi> {
  return apis.get('/manage/base/message')
}

/**
 * 操作日志
 */
export function apiOperationLogs(params: {
  [x: string]: any
  page: number
  pagesize: number
}, category?: number): Promise<InstApi> {
  if (category)
    params.category = category
  return apis.get('/manage/base/logs', { params })
}

/**
 * 更新密码
 */
export function apiEditPassword(
  old_password: string,
  password: string,
): Promise<InstApi> {
  return apis.patch('/manage/base/password', {
    old_password,
    password,
  })
}

/**
 * 获取配置
 */
export function apiSettings(): Promise<InstApi> {
  // 可以远程获取配置
  return new Promise((resolve) => {
    resolve(settings)
  }).then((res: any) => {
    if (res.code === 200)
      return res.data
    return res
  })
}
