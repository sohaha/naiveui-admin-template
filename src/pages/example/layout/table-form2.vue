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

// 自定义渲染操作栏
// setAction((row) => {
//   return h('div', '定义操作栏')
// })

// 自定义渲染整个操作栏（包括头部）
// setAction({
//   title: '操作',
//   key: 'more',
//   align: 'center',
//   render(row) {
//     return h('div', '自定义操作')
//   },
// })

setAction([
  {
    text: '其他',
    type: 'warning',
    key: 'other',
  },
])

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
  <Card id="data-table" padding="0" class="relative overflow-hidden">
    <div class="text-center p-2">
      <NButtonGroup size="small">
        <NButton>
          全部
        </NButton>
        <NButton>
          分类1
        </NButton>
        <NButton>
          分类2
        </NButton>
      </NButtonGroup>
    </div>
    <DataTable
      :bordered="false"
      :max-height="-(28 + 8)"
      :scroll-x="600"
      v-bind="config"
      @actions="actions"
    />
  </Card>

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
      "en": "Table2",
      "zh": "功能表格2"
    }
  }
}
</route>
