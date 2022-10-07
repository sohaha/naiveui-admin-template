<script lang="ts" setup>
import { mockLists } from '@/api/test'

// 过滤器
const showFilterDrawer = ref(false)
const { config: formConfig, setItems } = useDataForm()

setItems({
  name: {
    label: '数据 1',
    component: 'NInput',
    required: true,
  },
})
function submitForm(data: any) {
  console.log(data)
}

const showDrawer = ref(false)
const drawerAction = ref('')
function actions(data: any) {
  console.log('action', data)
  showDrawer.value = true
  drawerAction.value = data.action
}

// 表格配置
const { config, setRowKey, setColumns, setRequest, setToolbar, setAction } = useDataTable()

// 设置行主键
setRowKey('id')

// 请求数据
setRequest(
  (param: any) => {
    return mockLists(param)
  },
  {
    defaultParams: [
      {
        page: 1,
        pagesize: 30,
      },
    ],
  },
)

const filterOptions = ref({
  type: 'default',
  quaternary: true,
})
// 工具栏
setToolbar([{
  title: '过滤',
  icon: 'i-bx-filter',
  options: filterOptions,
  action: () => {
    // 修改过滤按钮样式
    filterOptions.value.type = 'primary'
    filterOptions.value.quaternary = false
    showFilterDrawer.value = true
  },
}, 'new', 'reload', 'columns', {
  title: '导出',
  icon: 'i-bx:export',
  action: () => {
    window.$message.info('点击了导出')
  },
}])

// setAction(false)

setAction([
  {
    text: '其他',
    type: 'warning',
    key: 'other',
  },
])

// setAction({
//   title: '更多',
//   key: 'more',
//   align: 'center',
//   render(row) {
//     return h('div', `更多${row.id}`)
//   },
// })

setColumns([
  {
    title: '编号',
    key: 'id',
    width: 70,
    align: 'left',
    // align: 'center',
  },
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '邮箱',
    key: 'email',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '创建时间',
    key: 'created_at',
    ellipsis: {
      tooltip: true,
    },
  },
])
</script>

<template>
  <DataTable
    id="data-table"
    :scroll-x="600"
    v-bind="config"
    @actions="actions"
  />

  <DrawerForm
    v-model:show="showDrawer"
    height="100vh"
    placement="top"
    closable
    v-bind="formConfig"
    :title="drawerAction"
    @submit="submitForm"
  />
  <DrawerForm
    v-model:show="showFilterDrawer"
    placement="top"
    :trap-focus="false"
    to="#data-table"
    v-bind="formConfig"
    title="过滤条件"
    @submit="submitForm"
  />
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "icon": "i-bx:list-ol",
    "i18n": {
      "en": "FunctionTable",
      "zh": "功能表格"
    }
  }
}
</route>
