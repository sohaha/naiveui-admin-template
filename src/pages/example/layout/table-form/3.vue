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
  <CardRows>
    <Card padding="10px">
      <div class="text-center">
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
    </Card>
    <DataTable
      id="data-table"
      :max-height="-(48 + (16 / 2))"
      :scroll-x="600"
      v-bind="config"
      @actions="actions"
    />
  </CardRows>
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
      "en": "Table3",
      "zh": "功能表格3"
    }
  }
}
</route>
