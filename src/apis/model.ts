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
  return apis.get(`/manage/model/${name}/data`, { params })
}

// 记录详情
export function apiModelData(model: string, id: string | number): Promise<InstApi> {
  return apis.get(`/manage/model/${model}/data/${id}`, { })
}

// 保存记录
export function apiModelSave(model: string, id: number, data: Record<string, any>): Promise<InstApi> {
  if (id)
    return apis.patch(`/manage/model/${model}/data/${id}`, data)
  return apis.post(`/manage/model/${model}/data`, data)
}

// 删除记录
export function apiModelDelete(model: string, id: number): Promise<InstApi> {
  return apis.delete(`/manage/model/${model}/data/${id}`)
}

// 文件列表
export function apiOSSLists(params: {
  page: number
  pagesize: number
}): Promise<InstApi> {
  return apis.get('/manage/oss', { params })
}

// 删除文件
export function apiOSSDelete(key: string): Promise<InstApi> {
  return apis.delete(`/manage/oss/${key}`)
}

// 上传文件
export function apiOSSUpload(files: File[], opt = {}): Promise<InstApi> {
  files = Array.from(files)
  const formData = new FormData()
  for (const file of files)
    formData.append('file', file)

  return apis.post('/manage/oss', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...opt,
  })
}
