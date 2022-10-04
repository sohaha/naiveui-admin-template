<script lang="ts" setup>
const { run: deleteUser } = useRequest(apiUserDelete, {
  manual: true,
  onBefore: () => {
    config.value.request.loading = true
  },
  onSuccess: (_, params) => {
    window.$message.success('删除成功')
    // 重新加载数据 或者直接移除列表数据
    const { data: d } = config.value.request
    if (d) {
      d.data.items = d.data.items.filter((v: any) => v.id !== params[0])
      if (d.data.items.length === 0)
        reload()
    }
    else {
      reload()
    }
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

const { run: updateUser } = useRequest(apiUserUpdate, {
  manual: true,
  onBefore: () => {
    setLoading(true)
  },
  onAfter: () => {
    setLoading(false)
  },
  onSuccess: () => {
    window.$message.success('编辑成功')
    reload()
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

const { run: createUser } = useRequest(apiUserCreare, {
  manual: true,
  onBefore: () => {
    setLoading(true)
  },
  onAfter: () => {
    setLoading(false)
  },
  onSuccess: () => {
    window.$message.success('添加成功')
    reload()
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

const { config: formConfig, setItems, setValues, setOptions, setLoading } = useDataForm()

setOptions({ labelPlacement: 'top' })
setItems({
  id: {
    label: 'ID',
    component: 'NInput',
    hidden: true,
  },
  username: {
    label: '用户名',
    component: 'NInput',
    required: true,
    disabled: true,
  },
  email: {
    label: '邮箱',
    component: 'NInput',
    required: true,
  },
  nickname: {
    label: '昵称',
    component: 'NInput',
    required: true,
  },
})

async function submitForm(data: any) {
  if (drawerAction.value === '编辑')
    await updateUser(data.id, data)
  else
    await createUser(data)

  showDrawer.value = false
}

const showDrawer = ref(false)
const drawerAction = ref('')
function actions(data: any) {
  console.log('action', data)

  if (data.action === 'delete') {
    deleteUser(data.row.id)
    return
  }

  showDrawer.value = true
  drawerAction.value = data.action === 'edit' ? '编辑' : '新增'

  nextTick(() => {
    setValues(data.row ?? {})
  })
}

const { config, setRowKey, setColumns, setRequest, setToolbar, setAction, reload } = useDataTable()

setRequest(apiUserList, { defaultParams: [{ pagesize: 50 }] })

setToolbar(['new', 'reload', 'columns'])

setAction([])

setColumns([
  {
    title: 'ID',
    key: 'id',
    width: 70,
    align: 'left',
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
    "icon": "i-bx:bxs-user-detail",
    "title": "用户管理",
    "i18n": {
      "en": "User"
    }
  }
}
</route>
