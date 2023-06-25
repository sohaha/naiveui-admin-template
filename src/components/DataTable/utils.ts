import {
  NButton,

  NIcon,

  NPopconfirm, NTooltip,
} from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import type { PaginationInfo } from 'naive-ui/lib/pagination/src/interface'
import type { ComponentPublicInstance, VNode, VNodeChild } from 'vue'
import { usePagination } from 'vue-use-api'
import type { PaginationBaseOptions } from 'vue-use-api/dist/types/usePagination'
export * from './info'

export function renderActionCol(
  click: Function,
  size: 'tiny' | 'small' | 'medium' | 'large' = 'small',
  more?: any[],
) {
  const children = (more || []).map((v) => {
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
        renderActionDelete(click, size),
      ],
    },
  )
}

export function renderActionDelete(
  click: Function,
  size: 'tiny' | 'small' | 'medium' | 'large' = 'small',
) {
  const popconfirmRef: any = ref(null)
  const hide = () => {
    popconfirmRef.value.$refs.popoverInstRef.setShow(false)
  }
  return h(
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
  )
}

const defaultParams = {
  page: 1,
  pagesize: 30,
}

export function useDataTable() {
  const tableRef = ref<ComponentPublicInstance | null>(null)
  const request = ref<any>({})
  const props = ref<{ [key: string]: any }>({})
  const action = ref<boolean | TableColumn>(true)
  const columns = ref<TableColumn[]>([])
  const pagination = ref<PaginationInfo>()
  const toolbar = ref<any[]>([]) // new, refresh, columns
  const rowKey = ref<any>((row: any) => row.id || row._id || row.key)
  const config = computed<any>(() => ({
    request: request.value,
    action: action.value,
    columns: columns.value,
    pagination: pagination.value,
    toolbar: toolbar.value,
    rowKey: rowKey.value,
    ref: tableRef,
    ...props.value,
  }))

  const params = computed(() => request.value?.params || [])

  return {
    tableRef,
    config,
    setRequest(api: Function, options?: PaginationBaseOptions<any, any>) {
      request.value = usePagination(api as any, {
        defaultParams: [{ ...(options?.defaultParams || defaultParams) }],
        ...(options || {}),
      })
    },
    setColumns(c: TableColumn[]) {
      columns.value = c as any
    },
    setProps(p: { [key: string]: any }) {
      props.value = p
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
    params,
    run(params: { [key: string]: any }) {
      const arrg = request.value?.params[0] || {}
      if (Object.keys(params).length === 0) {
        const { page, pagesize } = arrg

        return request.value?.run({ page, pagesize })
      }

      return request.value?.run({ ...arrg, ...params })
    },
    refresh() {
      nextTick(request.value?.refresh)
    },
  }
}

export const btnDefaultOption = {
  quaternary: true,
  circle: true,
}

export function createReloadIcon(btn: { [key: string]: any }): VNode {
  return h(
    NTooltip,
    {},
    {
      default: () => h('span', '刷新列表'),
      trigger: () => h(
        NButton,
        {
          ...btnDefaultOption,
          ...(btn || {}),
        },
        {
          default: () =>
            h(NIcon, { size: 18, class: 'i-bx:rotate-left' }),
        },
      ),
    },
  )
}

export function createNewIcon(btn: { [key: string]: any }): VNode {
  return h(
    NTooltip,
    {},
    {
      default: () => h('span', '添加数据'),
      trigger: () =>
        h(NButton, {
          size: 'small',
          ...btnDefaultOption,
          ...(btn || {}),
        }, {
          default: () =>
            h(NIcon, { size: 18, class: 'i-bx:layer-plus' }),
        }),
    },
  )
}
