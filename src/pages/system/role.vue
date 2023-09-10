<script lang="ts" setup>
import { h } from 'vue'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import { renderActionCol } from '@/components/DataTable/utils'

const expandedRowKeys = shallowRef<string[]>([])
const { config, setRequest, setRowKey, setColumns, setPagination, refresh, setAction } = useDataTable()
setRowKey('_id')
setRequest(apiRoleList, {
  onSuccess: (res) => {
    res.data = {
      items: res.data,
    }
  },
})
setAction((row) => {
  if (row.inlay)
    return h('div', { class: 'opacity-60' }, '[ 禁止操作 ]')

  return h('div', {}, [
    renderActionCol((action: string) => { actions({ action, row }) }),
  ])
})
setPagination(false)
const columns: TableColumn[] = [
  {
    title: '角色名称',
    key: 'name',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '角色别名(唯一)',
    key: 'key',
  },
]
setColumns(columns)

async function actions(data: any) {
  if (data.action === 'delete') {
    deleteRole(data.row._id)
    return
  }
  showDrawer.value = true
  if (data.action === 'edit')
    drawerAction.value = '修改角色'
  else
    drawerAction.value = '添加角色'

  nextTick(() => {
    setValues(data.row ?? {})
  })
}

const showDrawer = ref(false)
const drawerAction = ref('')
const { config: fromConfig, setItems, setValues, setLoading } = useDataForm()
setItems({
  _id: {
    label: '',
    component: 'NInput',
    hidden: true,
  },
  name: {
    label: '角色名称',
    component: 'NInput',
    required: true,
  },
  key: {
    label: '角色别名',
    component: 'NInput',
    required: true,
  },
})

const { run: deleteRole } = useRequest(apiRoleDelete, {
  manual: true,
  onBefore: (): any => {
    config.value.request.loading = true
  },
  onAfter: () => {
    config.value.request.loading = false
  },
  onSuccess: (_, params) => {
    window.$message.success('删除成功')
    refresh()
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

const { run: updateRole } = useRequest(apiRoleUpdate, {
  manual: true,
  onBefore: (): any => {
    setLoading(true)
  },
  onAfter: () => {
    setLoading(false)
  },
  onSuccess: () => {
    window.$message.success('编辑成功')
    refresh()
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

const { run: createRole } = useRequest(apiRoleCreare, {
  manual: true,
  onBefore: (): any => {
    setLoading(true)
  },
  onAfter: () => {
    setLoading(false)
  },
  onSuccess: () => {
    window.$message.success('添加成功')
    refresh()
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

async function submitForm(data: any) {
  console.log('submitForm', data, drawerAction.value)

  let res: any
  if (drawerAction.value === '修改角色')
    res = await updateRole (data._id, data)
  else
    res = await createRole (data)

  if (!res)
    return

  showDrawer.value = false
}
function addRole() {
  showDrawer.value = true
  drawerAction.value = 'add'
}
</script>

<template>
  <DrawerForm
    v-model:show="showDrawer"
    height="100vh"
    closable
    v-bind="fromConfig"
    :title="drawerAction"
    @submit="submitForm"
  />
  <Card id="data-table" padding="0" class="relative overflow-hidden">
    <DataTable
      :max-height="-(28 + 12 + 4)"
      :scroll-x="600"
      v-bind="config"
      :expanded-row-keys="expandedRowKeys"
      :render-expand-icon="() => {}"
      @actions="actions"
    >
      <template #right-toolbar>
        <NButton type="primary" size="small" @click="addRole">
          添加角色
        </NButton>
      </template>
    </DataTable>
  </Card>
</template>

<style scoped>
</style>

<route lang="json">
{ "meta": { "title": "角色管理" } }
</route>
