import axios from 'axios'
import type { InstApi } from '@/types/global'

export function mockLists(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get('/_mock/lists', {
    params,
    baseURL: '/',
  })
}

export function getWeather() {
  return axios.get('https://v0.yiketianqi.com/api?unescape=1&version=v61&appid=23035354&appsecret=8YvlPNrz')
}
