import {
  NButton, NPopconfirm,
} from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import type { PaginationInfo } from 'naive-ui/lib/pagination/src/interface'
import type { ComponentPublicInstance, VNodeChild } from 'vue'
import { usePagination } from 'vue-use-api'
import type { PaginationBaseOptions } from 'vue-use-api/dist/types/usePagination'
export * from './info'

export function renderActionCol(
  click: Function,
  size: 'tiny' | 'small' | 'medium' | 'large',
  more: any[],
) {
  const popconfirmRef: any = ref(null)
  const hide = () => {
    popconfirmRef.value.$refs.popoverInstRef.setShow(false)
  }

  const children = more.map((v) => {
    return h(
      NButton,
      {
        type: v.type || 'info',
        size,
        text: true,
        onClick() {
          click(v.key)
        },
      },
      { default: () => `[ ${v.text} ]` },
    )
  })

  return h(
    'div',
    {
      class: 'space-x-2 flex justify-evenly',
    },
    {
      default: () => [
        ...children,
        h(
          NButton,
          {
            type: 'info',
            size,
            text: true,
            onClick() {
              click('edit')
            },
          },
          { default: () => '[ 修改 ]' },
        ),
        h(
          NPopconfirm,
          {
            showIcon: false,
            placement: 'left',
            ref: popconfirmRef,
          },
          {
            default: () => '请确定是否删除？',
            trigger: () =>
              h(
                NButton,
                {
                  text: true,
                  type: 'error',
                  // ghost: true,
                  size,
                },
                { default: () => '[ 删除 ]' },
              ),
            action: () => [
              h(
                NButton,
                {
                  size,
                  onClick: hide,
                },
                { default: () => '取消' },
              ),
              h(
                NButton,
                {
                  type: 'error',
                  size,
                  onClick() {
                    click('delete')
                    hide()
                  },
                },
                { default: () => '确定删除' },
              ),
            ],
          },
        ),
      ],
    },
  )
}

export function useDataTable() {
  const tableRef = ref<ComponentPublicInstance | null>(null)
  const request = ref<any>({})
  const action = ref<boolean | TableColumn>(true)
  const columns = ref<TableColumn[]>([])
  const pagination = ref<PaginationInfo>()
  const toolbar = ref(['reload', 'columns']) // new, reload, columns
  const rowKey = ref<any>((row: any) => row.id || row.key)
  const config = computed(() => ({
    request: request.value,
    action: action.value,
    columns: columns.value,
    pagination: pagination.value,
    toolbar: toolbar.value,
    rowKey: rowKey.value,
    ref: tableRef,
  }))

  return {
    tableRef,
    config,
    setRequest(api: Function, options?: PaginationBaseOptions<any, any>) {
      request.value = usePagination(api as any, {
        defaultParams: [
          {
            page: 1,
            pagesize: 20,
          },
        ],
        ...(options || {}),
      })
    },
    setColumns(c: TableColumn[]) {
      columns.value = c as any
    },
    setRowKey(key: string) {
      rowKey.value = (row: any) => row[key]
    },
    setToolbar(t: any[]) {
      toolbar.value = t
    },
    setPagination(p: Object) {
      pagination.value = p as PaginationInfo
    },
    setAction(a: boolean | TableColumn | any[] | ((rowData: any, rowIndex: number) => VNodeChild)) {
      action.value = a as any
    },
    reload() {
      nextTick(request.value?.refresh)
    },
  }
}
