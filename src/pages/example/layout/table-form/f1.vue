<script lang="ts" setup>
import { useForm } from './form'
import { useTable } from './table'

const { config: formConfig, showDrawer, drawerAction, submitForm } = useForm()

const { config, showFilterDrawer } = useTable()

const router = useRouter()
function actions({ action = '', row = {} as Record<string, any> }) {
  console.log('action', action, row)
  if (action === 'other') {
    console.log('跳转到详情页面', row)
    router.push({
      path: `./${row.id}`,
    })
    return
  }
  showDrawer.value = true
  drawerAction.value = action
}
</script>

<template>
  <DataTable id="data-table" virtual-scroll :scroll-x="600" v-bind="config" @actions="actions" />

  <DrawerForm
    v-model:show="showDrawer" height="100vh" placement="right" closable v-bind="formConfig"
    :title="drawerAction" @submit="submitForm"
  />
  <DrawerForm
    v-model:show="showFilterDrawer" placement="top" :trap-focus="false" to="#data-table" v-bind="formConfig"
    title="过滤条件" @submit="submitForm"
  />
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "maxWidth":0,
    "multiWindow": false,
    "icon": "i-bx:table",
    "i18n": {
      "en": "Table1",
      "zh": "功能表格1"
    }
  }
}
</route>
