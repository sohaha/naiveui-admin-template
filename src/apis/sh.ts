import type { InstApi } from '@/types/global'

export function yclh(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get('/0xsys/yc60lh', {
    params,
  })
}
