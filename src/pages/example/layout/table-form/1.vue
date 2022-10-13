<script lang="ts" setup>
import { useForm } from './form'
import { useTable } from './table'

const { config: formConfig, showDrawer, drawerAction, submitForm } = useForm()

const { config, showFilterDrawer } = useTable()

function actions(data: any) {
  console.log('action', data)
  showDrawer.value = true
  drawerAction.value = data.action
}
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
    "icon": "i-bx:table",
    "i18n": {
      "en": "Table1",
      "zh": "功能表格1"
    }
  }
}
</route>
