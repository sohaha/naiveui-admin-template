import api from '@/api/index'
import menus from '@/menu'
import settings from '@/settings.json'
import type { InstApi } from '@/types/global'

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export function apiLogin(username: string, password: string): Promise<InstApi> {
  return api.post('/manage/base/login', { username, password })
}

/**
 * 退出
 */
export function apiLogout(): Promise<InstApi> {
  return api.post('/manage/base/logout')
}

/**
 * 当前用户信息
 */
export function apiMe(): Promise<InstApi> {
  return api.get('/manage/base/me')
}

/**
 * 心跳
 */
export function apiHeartbeat(): Promise<InstApi> {
  return api.get('/manage/base/message')
}

/**
 * 更新密码
 */
export function apiEditPassword(
  oldPasswd: string,
  password: string,
): Promise<InstApi> {
  return api.put('/manage/base/password', {
    old_passwd: oldPasswd,
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

/**
 * 获取菜单
 */
export function apiMenus(): Promise<InstApi> {
  return new Promise((resolve) => {
    resolve({ data: menus })
  }).then((res: any) => {
    if (res.code === 200)
      return res.data
    return res
  })
}
