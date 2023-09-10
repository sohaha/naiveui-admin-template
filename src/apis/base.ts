import settings from '@/settings.json'
import type { InstApi } from '@/types/global'

/**
 * 登录
 * @param account 用户名
 * @param password 密码
 */
export function apiLogin(account: string, password: string): Promise<InstApi> {
  return apis.post('/manage/base/login', { account, password })
}

/**
 * 站点配置
 */
export function apiSite(): Promise<InstApi> {
  return apiNoILock.get('/manage/base/site').then((v: any) => {
    if (v.data?.sitename)
      multiWindowStore().resetAppName(v.data.sitename)
    return v
  })
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
export function apiMe(options = {}) {
  return useRequest(async () => {
    lock.lockWrite()
    let resp
    try {
      resp = await apiNoILock.get('/manage/base/me')
      lock.unlockWrite()
      return resp
    }
    catch (error: any) {
      lock.unlockWrite()
      if (error)
        throw new Error(error?.message)
    }
  }, {
    cacheKey: 'me',
    staleTime: 3000,
    manual: true,
    onBefore(params) {
      return params
    },
    onAfter() {
    },
    onSuccess(_data) {
    },
    onError(err) {
      if (err)
        window.$message.error(err.message)
    },
    ...options,
  })
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
 * 更新用户信息
 */
export function apiMeUpdate(data: Record<string, any>): Promise<InstApi> {
  return apis.patch('/manage/base/me', data)
}

/**
 * 上传用户头像
 */
export function apiUploadAvatar(file: File): Promise<InstApi> {
  const formData = new FormData()
  formData.append('file', file)
  return apis.post('/manage/base/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
