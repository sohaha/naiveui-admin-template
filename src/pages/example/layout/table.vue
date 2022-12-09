<script lang="ts" setup>
import { mockLists } from '@/apis/test'

const { config, setPagination, setRowKey, setColumns, setRequest, setAction } = useDataTable()

// 不显示分页条
setPagination(false)

// 请求接口数据
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

setAction(false)

setColumns([
  {
    title: '编号',
    key: 'id',
    width: 70,
    align: 'left',
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
  <div>
    <DataTable :scroll-x="320" v-bind="config" />
  </div>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "i18n": {
      "en": "Table",
      "zh": "普通表格"
    }
  }
}
</route>
