import { apiModelDetail } from '@/apis/model'

export function useDetail() {
  const info = ref<{ [key: string]: any }>({})
  const status = ref(false)

  const { run: getInfo } = useRequest(apiModelDetail, {
    manual: true,
    onError: (err) => {
      window.$message.error(err.message)
      status.value = false
    },
    onSuccess: (res) => {
      info.value = res.data || {}
      status.value = true
    },
  })

  return {
    info, getInfo, status,
  }
}
