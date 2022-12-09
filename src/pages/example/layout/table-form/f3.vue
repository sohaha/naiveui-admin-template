<script lang="ts" setup>
import { useForm } from './form'
import { useTable } from './table'

const { config: formConfig, showDrawer, drawerAction, submitForm } = useForm()

const { config, showFilterDrawer, run: requestData, setToolbar } = useTable()

setToolbar([])

function actions({ action = '', row = {} as Record<string, any> }) {
  console.log('action', action, row)
  showDrawer.value = true
  drawerAction.value = action
}

const active = ref('')
watch(active, (v) => {
  requestData({ status: v, page: 1 })
})
</script>

<template>
  <CardRows>
    <Card padding="10px">
      <NRadioGroup v-model:value="active" size="small">
        <NRadioButton
          v-for="v in [{ label: '全部', value: '' }, { label: '正常', value: '1' }, { label: '禁用', value: '2' }]"
          :key="v.value"
          :value="v.value"
          :label="v.label"
        />
      </NRadioGroup>
    </Card>
    <DataTable
      id="data-table"
      :max-height="-(48 + 12 / 6)"
      :scroll-x="600"
      v-bind="config"
      @actions="actions"
    />
  </CardRows>
  <DrawerForm
    v-model:show="showDrawer"
    height="100vh"
    placement="right"
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
    "maxWidth":900,
    "icon": "i-bx:table",
    "i18n": {
      "en": "Table3",
      "zh": "功能表格3"
    }
  }
}
</route>
