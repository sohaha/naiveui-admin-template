import type { CreateAxiosDefaults } from 'axios'
import axios from 'axios'

export const lock = new ReadWriteLock()
export const baseURL = (import.meta.env.DEV && import.meta.env.VITE_DEV_PROXY === 'true')
  ? '/proxy'
  : (import.meta.env.VITE_APP_API_BASEURL as string)

const dynamicBaseURL = usePrefixStorage('baseURL', '')
const conf: CreateAxiosDefaults = {
  baseURL,
  timeout: import.meta.env.VITE_APP_API_TIMEOUT || 10000,
  responseType: 'json',
}
const api = axios.create(conf)

export function getBaseURL() {
  return api.defaults.baseURL
}

if (import.meta.env.VITE_APP_API_BASEURL_DYNAMIC === 'true') {
  if (dynamicBaseURL.value)
    api.defaults.baseURL = dynamicBaseURL.value

  let u = getQuery('__')
  try {
    u = window.atob(u || '')
  }
  catch (error) { }
  if (u)
    dynamicBaseURL.value = api.defaults.baseURL = u
}

api.interceptors.request.use(async (request: any) => {
  await lock.lockRead()
  return before(request)
})

api.interceptors.response.use(
  (response: any) => {
    lock.unlockRead()
    return after(response)
  },
  async (err: any) => {
    await lock.unlockRead()
    return afterError(err)
  },
)

export default api

export const apiNoILock = axios.create(conf)
apiNoILock.interceptors.request.use(before)

apiNoILock.interceptors.response.use(after, afterError)

const throttledFn = useThrottleFn(() => {
  const user = userStore()
  window?.$message?.error(user.getToken ? '登录状态已失效，请重新登录' : '请先登录')
  user.setToken('')
  window.$router.push({
    path: '/login',
    query: {
      redirect: window.$router?.currentRoute.value.fullPath,
    },
  })
}, 5000)

function errorHandler(status: number, error: Error) {
  if (status === 0)
    window?.$message?.error(error.message)
  else
    console.error(status, error)
}

function before(request: any) {
  const token = userStore().getToken
  if (token) {
    try {
      request.headers.Authorization = `Basic ${token}`
    }
    catch (e) {
      request.headers.Authorization = token
    }
  }

  if (!request.headers['Content-Type']) {
    if (typeof request.data === 'string' && request.method !== 'post')
      request.headers['Content-Type'] = 'text/plain'
    else if (typeof request.data === 'object')
      request.headers['Content-Type'] = 'application/json;charset=UTF-8'
  }

  return request
}

function after(response: any) {
  const { data, headers } = response
  let errMessage = ''
  if (data && typeof data !== 'object')
    errMessage = '接口返回数据非 JSON 格式'

  if (headers && headers['re-token'])
    userStore().setToken(headers['re-token'])

  if (data?.code === undefined)
    errMessage = '非合法接口格式'

  if (errMessage !== '') {
    const err = Error(errMessage)
    errorHandler(0, err)
    return Promise.reject()
  }
  return data
}

function afterError(err: any) {
  const response = err?.response || {}
  const { status = 0, data = {} } = response
  const cause = {}
  let message = err?.message
  const dataMsg = data?.msg || ''

  switch (status) {
    case 400:
      message = dataMsg || '输入不合法'
      // return Promise.reject(Error(message, cause))
      break
    case 401:
      throttledFn()
      return Promise.reject()
    case 403:
      message = '权限不足'
      break
    case 404:
      message = dataMsg || '接口不存在'
      break
    case 500:
      message = '服务端错误'
      if (dataMsg)
        message += `: ${data.msg}`
      break
    default:
      if (message === 'Network Error')
        message = '网络故障'
      else if (message.includes('timeout'))
        message = '接口请求超时'
      else if (message.includes('Request failed with status code'))
        message = `接口 ${message.slice(message.length - 3)} 异常`
  }
  errorHandler(0, Error(message, cause))

  return Promise.reject()
}
