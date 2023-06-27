<script lang="ts" setup>
import { useForm } from '../example/layout/table-form/form'
import { useTable } from './table'

const { config: formConfig, showDrawer, drawerAction, submitForm, setOptions, setItem } = useForm()

setOptions({
  labelWidth: 80,
  labelPlacement: 'left',
})
setItem(
  'name2', {
    label: '登录时间',
    component: 'div',
    slots: h('div', { class: 'flex' }, '暂无时间'),
  })

const { config, run: requestData } = useTable()

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
  <Card id="data-table" padding="0" class="relative overflow-hidden">
    <DataTable
      :max-height="-(28 + 12 + 5)"
      :scroll-x="600"
      v-bind="config"
      @actions="actions"
    >
      <div class="p-1">
        <NRadioGroup v-model:value="active" size="small">
          <NRadioButton
            v-for="v in [{ label: '全部', value: '' }, { label: '正常', value: '1' }, { label: '禁用', value: '2' }]"
            :key="v.value"
            :value="v.value"
            :label="v.label"
          />
        </NRadioGroup>
      </div>
    </DataTable>
  </Card>

  <DrawerForm
    v-model:show="showDrawer"
    height="100vh"
    placement="right"
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
    "title": "股票列表"
  }
}
</route>
