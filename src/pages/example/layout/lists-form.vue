<script lang="ts" setup>
import { mockLists } from '@/api/test'

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

const { config, setRowKey, setColumns, setRequest, setToolbar, setAction } = useDataTable()
setRowKey('id')
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

setToolbar(['new', 'reload', 'columns'])

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
    fixed: 'left',
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
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "icon": "i-bx:list-ol",
    "i18n": {
      "en": "Lists From",
      "zh": "列表布局"
    }
  }
}
</route>
