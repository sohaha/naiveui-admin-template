import type { InstApi } from '@/types/global'

// apiModelLists 模型列表
export function apiModelLists(): Promise<InstApi> {
  return apis.get('/manage/model', { })
}

// 记录详情
export function apiModelDetail(model: string): Promise<InstApi> {
  return apis.get(`/manage/model/${model}`, { })
}

export function apiModelView(model: string): Promise<InstApi> {
  return apis.get(`/manage/model/${model}/views`, { })
}

export function apiModelDatas(name: string, params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get(`/model/${name}`, { params })
}

// 记录详情
export function apiModelData(model: string, id: string | number): Promise<InstApi> {
  return apis.get(`/model/${model}/${id}`, { })
}

// 保存记录
export function apiModelSave(model: string, id: number, data: Record<string, any>): Promise<InstApi> {
  if (id)
    return apis.patch(`/model/${model}/${id}`, data)
  return apis.post(`/model/${model}`, data)
}

// 删除记录
export function apiModelDelete(model: string, id: number): Promise<InstApi> {
  return apis.delete(`/model/${model}/${id}`)
}
