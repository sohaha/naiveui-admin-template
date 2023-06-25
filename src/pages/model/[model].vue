<script lang="ts" setup>
import { format, parseISO } from 'date-fns'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import type { InstApi } from '@/types/global'

const route = useRoute()
const { model } = route.params

const { setColumns, setRequest, setToolbar, config, setAction, refresh } = useDataTable()
const multiWindow = multiWindowStore()

const loading = ref(true)
const { data } = useRequest(apiModelView, {
  defaultParams: [model as string],
  cacheKey: model ? `modelView::${model}` : '',
  staleTime: 60 * 60 * 1000,
})

let fields: string[] = []
const showDetail = ref(false)
const formatFields = ref<{ [key: string]: string }>({})
watch(data, (res: InstApi | undefined) => {
  if (res && res.code === 0) {
    const title = res.data.lists.title
    if (!title) {
      multiWindow.currentWindow!.close()
      return
    }
    multiWindow.currentWindow!.rename(`${title}`)

    const lc = res.data.lists?.columns || {}
    const lf = res.data.lists?.fields || []
    const columns: TableColumn[] = []
    Object.keys(lc).forEach((k) => {
      const e = lc[k]
      e.key = k
      if (e.type === 'time') {
        e.render = (row: any) => {
          return row[e.key] ? format(parseISO(row[e.key]), 'yyyy-MM-dd HH:mm:ss') : ''
        }
      }
      else if (e.options?.enum) {
        e.render = (row: any) => {
          const v = (e.options.enum).find((o: any) => o.value === `${row[e.key]}`)
          return v.label ?? row[e.key]
        }
      }
      const { layout, ...d } = e

      columns.push({ ...layout, ...d })
    })
    if (columns.length > 0) {
      const sort: TableColumn[] = []
      lf.forEach((k: string) => {
        sort.push(columns.find((e: any) => e.key === k)!)
      })
      setColumns(sort)
    }

    const dc = res.data.info?.columns || {}
    const detailKeys = Object.keys(dc)

    showDetail.value = detailKeys.length > 0
    if (showDetail.value)
      setToolbar(['new', 'refresh', 'columns'])
    else
      setAction(false)

    detailKeys.forEach((k) => {
      const { layout, ...e } = dc[k]
      const { props, component, ...other } = layout || {}
      dc[k].disabled = e.disabled
      dc[k].readonly = e.readonly
      dc[k].props = { ...(props || {}) }
      dc[k].other = other
      if (component) {
        dc[k].component = component
      }
      else {
        switch (e.type) {
          case 'int':
            dc[k].component = 'NInputNumber'
            break
          case 'uint':
            dc[k].component = 'NInputNumber'
            dc[k].props.min = 0
            break
          case 'json':
            dc[k].component = 'NInput'
            formatFields.value[k] = 'json'
            break
          case 'time':
            formatFields.value[k] = 'timestamp'
            dc[k].component = 'NDatePicker'
            dc[k].props.type = 'datetime'
            break
          default:
            if (e.options?.enum) {
              dc[k].component = 'NSelect'
              dc[k].props.options = e.options.enum
              formatFields.value[k] = 'string'
            }
            else {
              dc[k].component = 'NInput'
              if (e.size > 255)
                dc[k].props.type = 'textarea'
            }
        }
      }

      // todo dev
      // if (dc[k].component === 'NUpload')
      //   dc[k].props.multiple = true
    })
    fields = res.data?.info?.fields || []
    if (Object.keys(dc).length > 0) {
      const sort: Record<string, any> = {}
      fields.forEach((k: string) => {
        sort[k] = dc[k]
      })

      setItems(sort)
    }
  }

  loading.value = false
})

setRequest(
  (p: any) => {
    return apiModelDatas(model as string, p)
  },
)

onMounted(() => {
  config.value.request.loading = true
})

const { run: getRow, data: info } = useRequest(apiModelData, {
  manual: true,
  onBefore(params) {
    setLoading(true)
    return params
  },
  onAfter() {
    setLoading(false)
  },
  onError: (err) => {
    window.$message.error(err.message)
  },
})

const { run: deleteRow } = useRequest(apiModelDelete, {
  manual: true,
  onBefore(params) {
    config.value.request.loading = true
    return params
  },
  onAfter() {
    config.value.request.loading = false
  },
  onError: (err) => {
    window.$message.error(err.message)
  },
  onSuccess: () => {
    refresh()
  },
})

function hiddenColumn(hidden: boolean) {
  const fieldsToHide = ['_id', 'created_by', 'created_at', 'updated_at']
  fieldsToHide.forEach((field) => {
    if (fields.includes(field))
      setItem(field, { hidden })
  })
}

async function actions({ action = '', row = {} as Record<string, any> }) {
  const idValue = row.id || row._id || 0
  id.value = idValue
  switch (action) {
    case 'new':
      showDrawer.value = true
      hiddenColumn(true)
      setValues({})
      break
    case 'delete':
      await deleteRow(model as string, idValue)
      break
    case 'edit':
      hiddenColumn(false)
      await getRow(model as string, idValue)
      if (!info.value)
        return
      showDrawer.value = true
      setValues(formatData(info.value.data, formatFields.value))
      break
  }
}

function formatData(data: any, formatFields: any) {
  const d: any = {}
  Object.keys(data).forEach((k) => {
    switch (formatFields[k]) {
      case 'timestamp': d[k] = +parseISO(data[k])
        break
      case 'json': d[k] = JSON.stringify(data[k])
        break
      case 'string':
        d[k] = `${info.value?.data[k]}`
        break
      default: d[k] = data[k]
    }
  })
  return d
}

const { config: formConfig, setItems, setItem, setLoading, setValues, setOptions } = useDataForm()

setOptions({
  labelWidth: 80,
  labelPlacement: 'top',
})

const showDrawer = ref(false)
const id = ref<number>(0)

const { run: save } = useRequest(apiModelSave, {
  manual: true,
  onBefore: (params) => {
    setLoading(true)
    return params
  },
  onAfter: () => setLoading(false),
  onSuccess: () => {
    showDrawer.value = false
    window.$message.success(!id.value ? '添加成功' : '修改成功')
    refresh()
  },
  onError: err => window.$message.error(err.message),
})

async function submitForm(data: any) {
  await save(model as string, id.value, data)
}
</script>

<template>
  <DrawerForm
    v-if="!loading"
    v-model:show="showDrawer"
    :close-on-esc="true"
    :closable="true"
    v-bind="formConfig"
    :title="id ? '编辑记录' : '添加记录'"
    @submit="submitForm"
  />
  <LayoutLoading v-if="loading" height />
  <DataTable v-else id="data-table" :scroll-x="600" v-bind="config" @actions="actions" />
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "title":"记录列表",
    "activate":"/model"
  }
}
</route>

<i18n lang="json">
{}
</i18n>
