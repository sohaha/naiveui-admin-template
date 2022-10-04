import { ACard } from 'ayyui'
import { NButton, NDataTable, NIcon, NPagination, NTooltip } from 'naive-ui'
import type { TableColumns } from 'naive-ui/lib/data-table/src/interface'
import type { PropType } from 'vue'
import ColumnSetting from './components/index'
import { renderActionCol } from './utils'

export default defineComponent({
  name: 'DataTable',
  inheritAttrs: false,
  props: {
    request: {
      type: Object,
      required: true,
    },
    action: {
      type: [Boolean, Object],
      default: true,
    },
    maxHeight: {
      type: [Number, String] as PropType<string | number>,
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'small',
    },
    pagination: {
      type: [Boolean, Object],
      default: true,
    },
    toolbar: {
      type: Array,
    },
    columns: {
      type: Array as PropType<TableColumns<any>>,
      default: () => [],
      required: true,
    },
  },
  slots: [],
  emits: ['actions'],
  setup(p, ctx) {
    const { slots } = ctx
    const { size } = p

    const state = stateStore()
    const listsContentHeight = computed(
      () => state.getPageContentHeight - 40 - (p.pagination ? 44 + 16 : 2),
    )

    const select = ref<string[]>([])
    p.columns.forEach((v: any) => {
      select.value.push(v.key)
    })

    const lists = computed(() => {
      return (p.request?.data?.data?.items || []).map((item: any) => {
        return item
      })
    })

    const attrs = useAttrs()

    const pagination = computed<{ [key: string]: any }>(() => {
      if (!p.pagination) {
        return {
          itemCount: 0,
        }
      }
      let page = {
        'pageSizes': [10, 20, 50, 100],
        'pageSlot': 5,
        'itemCount': p.request.total,
        'pageSize': p.request.pagesize,
        'page': p.request.current,
        'showSizePicker': !state.isSmallScreen,
        // showQuickJumper: !state.isSmallScreen,
        'onUpdate:page': (i: number) => {
          // eslint-disable-next-line vue/no-mutating-props
          p.request.current = i
        },
        'onUpdate:pageSize': (i: number) => {
          // eslint-disable-next-line vue/no-mutating-props
          p.request.pagesize = i
        },
      }
      if (p.pagination !== true)
        page = { ...page, ...p.pagination }

      return page
    })

    function renderToolbar() {
      const btnOption = {
        size,
        quaternary: true,
        circle: true,
      }
      return h(
        'div',
        {
          class: 'flex space-x-0 items-center justify-around',
        },
        [
          h('span', '操作：'),
          p.toolbar?.includes('new') && h(
            NTooltip,
            {},
            {
              default: () => h('span', '添加数据'),
              trigger: () =>
                h(NButton, {
                  onClick: () => {
                    ctx.emit('actions', {
                      action: 'new',
                    })
                  },
                  ...btnOption,
                }, {
                  default: () =>
                    h(NIcon, { size: 18, class: 'i-bx:layer-plus' }),
                }),
            },
          ),
          p.toolbar?.includes('columns') && h(
            ColumnSetting as any,
            {
              'columns': p.columns,
              'select': select.value,
              'onUpdate:select': (s: string[]) => {
                select.value = s
              },
            },
            {
              default: () =>
                h(
                  NTooltip,
                  {},
                  {
                    default: () => h('span', '列设置'),
                    trigger: () =>
                      h(NButton, btnOption, {
                        default: () =>
                          h(NIcon, { size: 18, class: 'i-bx:wrench' }),
                      }),
                  },
                ),
            },
          ),
          p.toolbar?.includes('reload') && h(
            NTooltip,
            {},
            {
              default: () => h('span', '刷新列表'),
              trigger: () =>
                h(
                  NButton,
                  {
                    ...btnOption,
                    onClick: p.request.refresh,
                  },
                  {
                    default: () =>
                      h(NIcon, { size: 18, class: 'i-bx:rotate-left' }),
                  },
                ),
            },
          ),
        ],
      )
    }
    const defAction = {
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      title: () => {
        return p.toolbar && p.toolbar?.length > 0 ? renderToolbar() : '操作'
      },
    }

    const getBindValues = computed(() => {
      const values: any = { ...attrs }
      if (!p.maxHeight) {
        if (listsContentHeight.value > 0)
          values.maxHeight = listsContentHeight.value
      }
      else {
        values.maxHeight = p.maxHeight
      }

      values.columns = p.columns.filter((c: any) => {
        return select.value.includes(c.key)
      })
      if (p.action === true) {
        values.columns.push({
          ...defAction,
          render: (row: any) => {
            return renderActionCol(
              (action: string) => {
                ctx.emit('actions', {
                  action,
                  row,
                })
              },
              'small',
              [],
            )
          },
        })
      }
      else if (Array.isArray(p.action)) {
        values.columns.push({
          ...defAction,
          width: defAction.width + p.action.length * 60,
          render: (row: any) => {
            return renderActionCol(
              (action: string) => {
                ctx.emit('actions', {
                  action,
                  row,
                })
              },
              'small',
              p.action as [],
            )
          },
        })
      }
      else if (p.action !== false) {
        values.columns.push(p.action)
      }

      values.data = lists.value
      values.size = p.size
      values.loading = p.request.loading

      // values.style = '--n-merged-th-color: transparent'
      return values
    })

    const boxClass = computed(() => {
      let c = 'z-data-table '
      const { columns } = getBindValues.value

      if (
        columns.length > 0
        && (columns[0].align === 'left' || !columns[0].align)
      )
        c += ' z-data-table--pl'

      return c
    })

    return () =>
      h(
        'div',
        {
          class: boxClass.value,
        },
        [
          h(
            ACard,
            {},
            {
              default: () => {
                const slot: any = {}
                if (slots.empty)
                  slot.empty = slots.empty
                const v = getBindValues.value
                let page
                if (pagination.value.itemCount > 0)
                  page = pagination.value
                else if (!(v.data && v.data.length > 0))
                  v.minHeight = v.maxHeight + 44

                return [
                  h(NDataTable, v, slots),
                  page
                    && h(
                      'div',
                      {
                        class: 'flex justify-end overflow-auto p-2',
                      },
                      h(NPagination, page),
                    ),
                ]
              },
            },
          ),
        ],
      )
  },
})
