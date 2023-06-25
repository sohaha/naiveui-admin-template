<script lang="ts" setup>
// const user = userStore()
// const state = stateStore()

import { h } from 'vue'
import { NIcon } from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import inlayMenu from '@/menu'

const menuJSON = ref<any[]>([])

const { run: reset } = useRequest(apiMenuReset, {
  manual: true,
})
const { t, locale } = useI18n()
const routes = useRouter()
const resetMenu = async () => {
  menuJSON.value = completionRouteTitle(inlayMenu, routes.getRoutes(), locale.value, t)
  await reset(menuJSON.value)
  refresh()
}

const expandedRowKeys = shallowRef<string[]>([])
const { config, setRequest, setRowKey, setToolbar, setColumns, setPagination, refresh, setAction } = useDataTable()
setRowKey('_id')
setRequest(apiMenuList, {
  onSuccess: (res) => {
    expandedRowKeys.value = (res.data || []).map((v: { [key: string]: any }) => v._id)
    res.data = {
      items: res.data,
    }
  },
})
setToolbar([])
setPagination(false)
const columns: TableColumn[] = [
  {
    title: '菜单标题',
    key: 'title',
    ellipsis: {
      tooltip: true,
    },
    render: ({ title, type, icon }) => {
      return h('span', {
        class: type === 'divider' ? 'text-gray-500' : '',
      }, [title as string])
    },
  },
  {
    title: '图标',
    key: 'icon',
    width: 60,
    render: ({ icon }) => {
      return h(NIcon, { class: `${icon} mr-1`, size: 20 })
    },
  },
  {
    title: '菜单路径',
    key: 'path',
    minWidth: 120,
    ellipsis: {
      tooltip: true,
    },
    render: ({ path, type }) => {
      return h('span', {
      }, type === 'divider' ? '-' : (path as string))
    },
  },
  {
    title: '排序',
    key: 'sort',
    width: 60,
    ellipsis: {
      tooltip: true,
    },
  },
]
setColumns(columns)

function actions({ action = '', row = {} as Record<string, any> }) {
  console.log('action', action, row)
}
</script>

<template>
  <Card id="data-table" padding="0" class="relative overflow-hidden">
    <DataTable
      :max-height="-(28 + 12 + 4)"
      :scroll-x="600"
      v-bind="config"
      :expanded-row-keys="expandedRowKeys"
      :render-expand-icon="() => {}"
      @actions="actions"
    >
      <!-- <NButton type="primary" size="small" @click="resetMenu">
        添加菜单
      </NButton> -->
      <template #right-toolbar>
        <div class2="text-right w-full">
          <NButton type="info" size="small" @click="resetMenu">
            重置菜单
          </NButton>
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<style scoped>
:deep(.n-data-table-expand-trigger),:deep(.n-data-table-expand-placeholder) {
  display:none;
}
</style>

<route lang="json">
{ "meta": { "title": "菜单管理" } }
</route>
