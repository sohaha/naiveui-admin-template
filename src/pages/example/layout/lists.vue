<script lang="ts" setup>
import { mockLists } from '@/api/test'

const { config, setPagination, setRowKey, setColumns, setRequest, setAction } = useDataTable()

// 数据唯一字段
setRowKey('id')

// 不显示分页条
setPagination(false)

setRequest(
  (param: any) => {
    // 请求接口数据
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
    // align: 'center',
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
  <div>
    <DataTable :scroll-x="600" v-bind="config" />
  </div>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "icon": "i-bx:list-ol",
    "i18n": {
      "en": "Lists",
      "zh": "列表展示"
    }
  }
}
</route>
