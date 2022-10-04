<script lang="ts" setup>
import type { TableColumns } from 'naive-ui/lib/data-table/src/interface'
import type { PropType } from 'vue'
const props = defineProps({
  columns: {
    type: Array as PropType<TableColumns>,
    default: () => [],
    required: true,
  },
  select: {
    type: Array,
    required: true,
  },
})

const columns = props.columns.filter((v: any) => {
  return typeof v.title !== 'function'
})

const keys = useVModel(props, 'select') as any
</script>

<template>
  <NPopover trigger="click" placement="bottom-end">
    <template #trigger>
      <slot />
    </template>
    <div>
      <NCheckboxGroup v-model:value="keys" :min="1">
        <div v-for="v in (columns as any)" :key="v.key">
          <NCheckbox :value="v.key" :label="v.title" />
        </div>
      </NCheckboxGroup>
    </div>
  </NPopover>
</template>

<style>
.z-data-table--pl .n-data-table .n-data-table-td:first-child,
.z-data-table--pl .n-data-table .n-data-table-th.n-data-table-th:first-child {
  padding-left: 1rem;
}
</style>
