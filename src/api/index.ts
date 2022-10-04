import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_DEV_PROXY
    ? '/proxy'
    : (import.meta.env.VITE_APP_API_BASEURL as string),
  timeout: import.meta.env.VITE_APP_API_TIMEOUT || 10000,
  responseType: 'json',
})

const source = axios.CancelToken.source()
const lock = false

api.interceptors.request.use((request: any) => {
  if (lock)
    source.cancel()
  const token = userStore().getToken
  if (token) {
    try {
      request.headers.Authorization = `Basic ${token}`
    }
    catch (e) {
      request.headers.Authorization = token
    }
  }

  if (typeof request.data === 'string' && request.method !== 'post')
    request.headers.post['Content-Type'] = 'text/plain'
  else if (typeof request.data === 'object')
    request.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

  return request
})

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

api.interceptors.response.use(
  (response: any) => {
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
  },
  (err: any) => {
    const response = err?.response || {}
    const { status = 0, data = {} } = response
    const cause = {}
    let message = err?.message

    switch (status) {
      case 400:
        message = data?.msg || '输入不合法'
        return Promise.reject(Error(message, cause))
        // break
      case 401:
        throttledFn()
        return Promise.reject()
      case 403:
        message = '权限不足'
        break
      case 500:
        message = '服务端异常'
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
  },
)

export default api

function errorHandler(status: number, error: Error) {
  if (status === 0)
    window?.$message?.error(error.message)
  else
    console.error(status, error)
}
