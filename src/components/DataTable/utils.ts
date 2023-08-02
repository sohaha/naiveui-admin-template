import {
  NButton,
  NIcon,
  NInput,
  NPopconfirm, NTooltip,
} from 'naive-ui'
import type { PaginationInfo } from 'naive-ui/lib/pagination/src/interface'
import type { ComponentPublicInstance, VNode, VNodeChild, VNodeRef } from 'vue'
import { usePagination } from 'vue-use-api'
import type { PaginationBaseOptions } from 'vue-use-api/dist/types/usePagination'
import type { Type } from 'naive-ui/lib/button/src/interface'
import type { TableColumn } from '@/types/global'
export * from './info'

export const showOrEdit = defineComponent({
  props: {
    value: [String, Number],
    editableComponent: {
      type: [Object, String],
      default: NInput,
    },
    onUpdateValue: [Function, Array],
  },
  setup(props: any) {
    const isEdit = ref(false)
    const oldValue = ref(`${props.value}`)
    const inputRef = ref<null | VNodeRef>(null)
    const inputValue = ref(oldValue.value)
    function handleOnClick() {
      isEdit.value = true
      oldValue.value = inputValue.value
      nextTick(() => {
        inputRef.value!.focus()
      })
    }
    function handleChange() {
      props.onUpdateValue(inputValue.value)
      isEdit.value = false
    }
    return () =>
      h(
        'div',
        {
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(NInput, {
            ref: inputRef,
            value: inputValue.value,
            onUpdateValue: (v) => {
              inputValue.value = v
            },
            onKeyup(event) {
              if (event.key === 'Enter' || event.keyCode === 13)
                handleChange()
            },
            // onChange: handleChange,
            onBlur() {
              if (oldValue.value === inputValue.value)
                isEdit.value = false
              // inputValue.value = oldValue.value
            },
          })
          : props.value,
      )
  },
})

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
  return renderActionPopconfirm(() => click('delete'), h(
    NButton,
    {
      text: true,
      type: 'error',
      size,
    },
    { default: () => '[ 删除 ]' },
  ), '请确定是否删除？', { okBtnText: '确定删除', okBtnType: 'error' }, size)
}

export function renderActionPopconfirm(
  click: Function,
  trigger: VNode,
  tip: string,
  args: { okBtnType?: Type; okBtnText?: string; cancelBtnText?: string },
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
      default: () => tip,
      trigger: () => trigger,
      action: () => [
        h(
          NButton,
          {
            size,
            onClick: hide,
          },
          { default: () => args.cancelBtnText || '取消' },
        ),
        h(
          NButton,
          {
            type: args.okBtnType || 'success',
            size,
            onClick(e) {
              click(e)
              hide()
            },
          },
          { default: () => args.okBtnText || '确定' },
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
    setRowKey(key: string | Function) {
      if (typeof key === 'string') {
        rowKey.value = (row: any) => row[key]
        return
      }
      rowKey.value = key
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
