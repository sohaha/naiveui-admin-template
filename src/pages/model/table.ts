import { format, parseISO } from 'date-fns'
import { apiModelView } from '@/apis/model'
import type { InstApi } from '@/types/global'

export function useTable(model: string) {
  const table = useDataTable()
  const multiWindow = multiWindowStore()

  const loading = ref(true)
  const { data } = useRequest(apiModelView, {
    defaultParams: [model as string],
    cacheKey: model ? `modelView::${model}` : '',
    staleTime: 60 * 60 * 1000,
  })

  watch(data, (res: InstApi | undefined) => {
    if (res && res.code === 0) {
      multiWindow.currentWindow!.rename(`${res.data.lists.title}`)
      const columns = res.data.lists.columns.map((e: { [key: string]: any }) => {
        if (e.type === 'time') {
          e.render = (row: any) => {
            return format(parseISO(row[e.key]), 'yyyy-MM-dd HH:mm:ss')
          }
        }
        console.log('e', e)

        return e
      })
      setColumns(columns)
    }

    loading.value = false
  })

  const { setColumns, setRequest, setToolbar, config } = table

  // setAction([
  //   {
  //     text: '其他',
  //     type: 'warning',
  //     key: 'other',
  //   },
  // ])

  setRequest(
    (p: any) => {
      return apiModelDatas(model as string, p)
    },
  )

  onMounted(() => {
    config.value.request.loading = true
  })

  setToolbar(['new', 'refresh', 'columns'])

  return { ...table, loading }
}
