<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useDetail } from './info'

const router = useRouter()

const { getInfo, info, status: showJSON } = useDetail()
const json = computed(() => {
  return JSON.stringify(info.value || {}, null, 2)
})

const { config, setPagination, setRowKey, setColumns, setRequest, setAction, setToolbar } = useDataTable()

setRowKey('key')

setPagination(false)

setRequest(apiModelLists, {
  defaultParams: [],
  onSuccess: (res) => {
    res.data = { items: res.data }
  },
})

setToolbar([])

setAction({
  title: '操作',
  key: 'more',
  width: 120,
  render(row: any) {
    const views = row.views || []
    return h('div', { class: 'space-x-2 flex justify-evenly' }, [
      h(
        NButton,
        {
          disabled: !views.includes('lists'),
          type: 'success',
          text: true,
          onClick: () => {
            router.push(`./model/${row.key}`)
          },
        },
        { default: () => '[ 数据 ]' },
      ),
      h(
        NButton,
        {
          text: true,
          type: 'primary',
          onClick: async () => {
            await getInfo(row.key)
          },
        },
        { default: () => '[ 配置 ]' },
      ),
    ])
  },
})

setColumns([
  {
    title: '模型标题',
    key: 'name',
    width: 130,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '模型别名',
    key: 'key',
    align: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '数据表名',
    key: 'table',
    ellipsis: {
      tooltip: true,
    },
  },
])
</script>

<template>
  <CardCols class="flex">
    <!-- <DataTable class="w-[200px]" v-bind="config" /> -->
    <!-- <Card class="col-span-1">
      dd
    </Card> -->
    <DataTable class="" v-bind="config" />
  </CardCols>
  <div>
    <Drawer v-model:show="showJSON" closable placement="center" title="模型配置">
      <div>
        <NInput
          v-model:value="json"
          readonly type="textarea" :autosize="{
            minRows: 10,
          }"
        />
      </div>
    </Drawer>
  </div>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "title":"模型列表"
  }
}
</route>
