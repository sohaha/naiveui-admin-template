<script lang="ts" setup>
import { format, parseISO } from 'date-fns'
import { NTag } from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'

const { run, config, setRowKey, setColumns, setRequest, setAction } = useDataTable()
const category = ref(3)

setRequest(
  (param: any) => {
    return apiOperationLogs(param, category.value)
  },
)

const route = useRoute()
watch(
  () => [route.query, category.value],
  (v) => {
    run({ category: v, page: 1 })
  },
)

const isLoginLog = computed(() => category.value === 3)

setAction(false)

setRowKey('_id')

const column: TableColumn[] = [
  {
    expandable: row => !!row.detail || !isLoginLog.value,
    type: 'expand',
    renderExpand: (row) => {
      const child = [
        isLoginLog.value && h('div', { class: 'text-gray-500' }, `操作详情：${row.detail}`),
      ]
      if (!isLoginLog.value) {
        const d = []
        d.push(h('div', `操作人：${row.nickname || row.account}`))
        if (row.detail)
          d.push(h('div', `操作详情：${row.detail}`))
        d.push(h('div', `IP :${row.ip}`))
        d.push(h('div', `浏览器 :${row.browser || ''} ${row.browser_version || ''}`))

        child.push(h('div', { class: 'text-gray-500' }, d))
      }

      return h('div', { class: 'space-x-2 flex px-4 pl-8' }, child)
    },
  },
  {
    title: '操作',
    key: 'action',
    ellipsis: {
      tooltip: true,
    },
    width: 100,
    render: (row: any) => {
      return h('div', {
        class: row.status === 1 && 'text-red-500',
      }, [row.action])
    },
  },
  {
    title: '模块',
    key: 'module',
    ellipsis: {
      tooltip: true,
    },
    width: 100,
  },
  {
    title: '系统',
    key: 'os',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '浏览器',
    key: 'browser',
    ellipsis: {
      tooltip: true,
    },
    render: (row: any) => {
      return `${row.browser || ''} ${row.browser_version || ''}`
    },
  },
  {
    title: '请求路径',
    key: 'path',
    ellipsis: {
      tooltip: true,
    },
    render: (row: any) => {
      return h('div', {
      }, [h('span', { class: 'text-gray-5 pr-1 text-xs' }, `[${row.method}]`), `${row.path}`])
    },
  },
  {
    title: 'IP',
    key: 'ip',
    ellipsis: {
      tooltip: true,
    },
    width: 120,
  },
  {
    title: 'IP 归属地',
    key: 'ip_region',
    ellipsis: {
      tooltip: true,
    },
    align: 'center',
    width: 120,
  },
  {
    title: '处理结果',
    key: 'result',
    width: 90,
    align: 'center',
    ellipsis: {
      tooltip: true,
    },
    render: (row: any) => {
      const ok = row.result === 1
      return h(NTag, { type: ok ? 'success' : 'error' }, {
        default: () => ok ? '成功' : '失败',
      })
    },
  },
  {
    title: '记录时间',
    key: 'created_at',
    ellipsis: {
      tooltip: true,
    },
    width: 180,
    render: (row: any) => {
      return format(parseISO(row.created_at), 'yyyy-MM-dd HH:mm:ss')
    },
  },
]

setColumns(column)
watch(category, (v) => {
  nextTick(() => {
    const fields = isLoginLog.value ? ['action', 'ip_region', 'os', 'browser', 'ip', 'created_at'] : ['result', 'ip_region', 'module', 'method', 'path', 'created_at']
    setColumns(column.filter((v: any) => !v.key || fields.includes(v.key)))
  })
}, {
  immediate: true,
})

const state = stateStore()
onMounted(() => {
  state.setUnreadMessage(0)
})

function actions({ action = '', row = {} as Record<string, any> }) {
  console.log('action', action, row)
}
</script>

<template>
  <Card id="data-table" padding="0" class="relative overflow-hidden">
    <div class="text-center p-2">
      <NRadioGroup v-model:value="category" size="small">
        <NRadioButton
          v-for="v in [{ label: '登录日志', value: 3 }, { label: '操作日志', value: 2 }]" :key="v.value"
          :value="v.value" :label="v.label"
        />
      </NRadioGroup>
    </div>
    <NDivider class="!m-0" />
    <DataTable :max-height="-(28 + 12)" :scroll-x="600" v-bind="config" @actions="actions" />
  </Card>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "multiWindow": true,
    "activate": "/",
    "title": "消息中心"
  }
}
</route>
