import { ACard } from 'ayyui'
import { NButton, NDataTable, NEllipsis, NIcon, NPagination, NTooltip } from 'naive-ui'
import type { TableColumns } from 'naive-ui/lib/data-table/src/interface'
import type { PropType } from 'vue'
import { resolveDirective, withDirectives } from 'vue'
import ColumnSetting from './components'
import { btnDefaultOption, createNewIcon, createReloadIcon, renderActionCol } from './utils'

export default defineComponent({
  name: 'ZDataTable',
  inheritAttrs: false,
  props: {
    id: {
      type: String,
    },
    request: {
      type: Object,
      required: true,
    },
    action: {
      type: [Boolean, Object, Function],
      default: true,
    },
    maxHeight: {
      type: [Number, String],
    },
    minHeight: {
      type: [Number, String, Boolean],
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

    const { t } = useI18n()
    const state = stateStore()
    const listsContentHeight = computed(
      () => state.getPageContentHeight - 40 - (p.pagination ? 44 + 16 : 2),
    )

    const select = ref<string[]>([])
    p.columns.forEach((v: any) => {
      select.value.push(v.key)
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
        'pageSizes': [10, 20, 30, 50, 100],
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

    const btnOption = {
      ...btnDefaultOption,
      size,
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
      else if (typeof p.maxHeight === 'number' && p.maxHeight < 0) {
        if (listsContentHeight.value > 0)
          values.maxHeight = listsContentHeight.value + p.maxHeight
      }
      else {
        values.maxHeight = p.maxHeight
      }

      if (typeof p.minHeight === 'number') {
        if (p.minHeight < 0) {
          if (listsContentHeight.value > 0)
            values.minHeight = listsContentHeight.value + p.minHeight
        }
        else {
          values.minHeight = p.minHeight
        }
      }
      else if (p.minHeight === true) {
        values.minHeight = listsContentHeight.value
      }
      else if (p.minHeight) { values.minHeight = p.minHeight }

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
      else if (typeof p.action === 'function') {
        values.columns.push({
          ...defAction,
          render: p.action,
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

    const throttled = resolveDirective('throttled')!

    function getToolbar(t: string | { [key: string]: any }) {
      if (typeof t === 'string') {
        switch (t) {
          case 'columns':
            return h(
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
            )
          case 'new':
            return createNewIcon({
              ...btnOption,
              onClick: () => {
                ctx.emit('actions', {
                  action: 'new',
                })
              },
            })
          case 'reload':
            return createReloadIcon({ ...btnOption, onClick: p.request.refresh })
        }
      }
      else if (t) {
        const { title = '', action = () => {}, icon = '', options = {} } = t
        return h(
          NTooltip,
          {},
          {
            default: () => h('span', title || ''),
            trigger: () =>
              withDirectives(h(
                NButton,
                {
                  ...btnOption,
                  ...options,
                  onClick: action,
                },
                {
                  default: () =>
                    h(NIcon, { size: 18, class: icon }),
                },
              ), [[throttled, '', '1000']]),
          },
        )
      }
      return null
    }

    function renderToolbar() {
      return h(
        'div',
        {
          class: 'flex space-x-0 items-center justify-around',
        },
        [
          h(NEllipsis, {
          }, { default: () => t('operation_tip') }),
          ...p.toolbar!.map((v: any) => getToolbar(v)),
        ],
      )
    }

    return () =>
      h(
        'div',
        {
          class: boxClass.value,
        },
        [
          h(
            ACard,
            {
              id: p.id,
              class: 'relative',
            },
            {
              default: () => {
                const slot: any = {}
                if (slots.empty)
                  slot.empty = slots.empty
                const v = getBindValues.value
                const hasData = (v.data && v.data.length > 0)
                let page

                if (pagination.value.itemCount > 0) { page = pagination.value }
                else if (v.loading && !hasData && !v.minHeight) {
                  if (Object.keys(pagination.value).length > 1)
                    v.minHeight = v.maxHeight + 44
                  else
                    v.minHeight = v.maxHeight
                }

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
