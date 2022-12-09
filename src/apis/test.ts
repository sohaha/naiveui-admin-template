import type { InstApi } from '@/types/global'

// function getHost() {
//   return import.meta.env.VITE_DEV_PROXY ? window.location.origin : ''
// }

export function mockLists(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get('/_mock/lists', {
    params,
    baseURL: '/',
  })
}
