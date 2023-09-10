<script lang="ts" setup>
import { renderActionCol } from '@/components/DataTable/utils'

const { run: deleteUser } = useRequest(apiUserDelete, {
  manual: true,
  onBefore: (): any => {
    config.value.request.loading = true
  },
  onAfter: () => {
    config.value.request.loading = false
  },
  onSuccess: (_, params) => {
    window.$message.success('删除成功')
    // 重新加载数据 或者直接移除列表数据
    const { data: d } = config.value.request
    if (d) {
      d.data.items = d.data.items.filter((v: any) => v._id !== params[0])
      if (d.data.items.length === 0)
        refresh()
    }
    else {
      refresh()
    }
  },
  onError: (error) => {
    window.$message.error(error.message)
  },
})

const { run: updateUser } = useRequest(apiUserUpdate, {
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

const { run: createUser } = useRequest(apiUserCreare, {
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

const { config: formConfig, setItems, setItem, setValues, setOptions, setLoading } = useDataForm()

setOptions({ labelPlacement: 'top' })
setItems({
  _id: {
    label: 'ID',
    component: 'NInput',
    hidden: true,
  },
  account: {
    label: '用户名',
    component: 'NInput',
    required: true,
  },
  password: {
    label: '密码',
    component: 'NInput',
    required: true,
    props: {
      type: 'password',
      showPasswordOn: 'click',
    },
    hidden: false,
  },
  nickname: {
    label: '昵称',
    component: 'NInput',
    required: true,
  },
  status: {
    label: '状态',
    component: 'NSelect',
    defaultValue: 1,
    options: [
      { label: '待激活', value: 0 },
      { label: '正常中', value: 1 },
      { label: '已禁用', value: 2 },
    ],
    required: true,
  },
  remark: {
    label: '备注',
    component: 'NInput',
    props: {
      type: 'textarea',
    },
  },
})

async function submitForm(data: any) {
  console.log('submitForm', data, drawerAction.value)

  let res: any
  if (drawerAction.value === '修改用户')
    res = await updateUser(data._id, data)
  else
    res = await createUser(data)

  if (!res)
    return

  showDrawer.value = false
}

const showDrawer = ref(false)
const drawerAction = ref('')
async function actions(data: any) {
  if (data.action === 'delete') {
    deleteUser(data.row._id)
    return
  }
  showDrawer.value = true
  if (data.action === 'edit') {
    setItem('password', { hidden: true })
    setItem('account', { disabled: true })
    drawerAction.value = '修改用户'
  }
  else {
    drawerAction.value = '添加用户'
    setItem('account', { disabled: false })
    setItem('password', { hidden: false })
  }

  nextTick(() => {
    setValues(data.row ?? {})
  })
}

const { config, setColumns, setRequest, setAction, refresh } = useDataTable()

setAction((row) => {
  if (row.inlay)
    return h('div', { class: 'opacity-60' }, '[ 禁止操作 ]')

  return h('div', {}, [
    renderActionCol((action: string) => { actions({ action, row }) }),
  ])
})

setRequest(apiUserList, { defaultParams: [{ pagesize: 50 }] })

setColumns([
  {
    title: 'ID',
    key: '_id',
    width: 120,
    align: 'left',
    fixed: 'left',
    render(row: any) {
      return h('span', { class: 'font-mono' }, row._id)
    },
  },
  {
    title: '账号',
    key: 'account',
  },
  {
    title: '昵称',
    key: 'nickname',
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
  {
    title: '最后登录时间',
    key: 'login_at',
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
      "en": "User",
      "zh": "用户管理"
    }
  }
}
</route>
