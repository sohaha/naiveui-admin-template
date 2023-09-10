import { NTag } from 'naive-ui'
import { mockLists } from '@/apis/test'

export function useTable() {
  const table = useDataTable()

  // 过滤器
  const showFilterDrawer = ref(false)

  // 表格配置
  const { setRowKey, setColumns, setRequest, run, setToolbar, setAction, setProps } = table

  // 设置行主键
  setRowKey('id')

  // 请求数据
  setRequest(
    (param: any) => {
      return mockLists(param)
    },
  )

  const filterOptions = ref({
    type: 'default',
    quaternary: true,
  })

  // 工具栏
  setToolbar([{
    title: '过滤',
    icon: 'i-bx-filter',
    options: filterOptions,
    action: () => {
      // 修改过滤按钮样式
      filterOptions.value.type = 'primary'
      filterOptions.value.quaternary = false
      showFilterDrawer.value = true
    },
  }, 'new', 'refresh', 'columns', {
    title: '导出',
    icon: 'i-bx:export',
    action: () => {
      window.$message.info('点击了导出')
    },
  }])

  // 自定义渲染操作栏
  // setAction((row) => {
  //   return h('div', '定义操作栏')
  // })

  // 自定义渲染整个操作栏（包括头部）
  // setAction({
  //   title: '操作',
  //   key: 'more',
  //   align: 'center',
  //   render(row) {
  //     return h('div', '自定义操作')
  //   },
  // })

  setAction([
    {
      text: '其他',
      type: 'warning',
      key: 'other',
    },
  ])

  setColumns([
    {
      title: '编号',
      key: 'id',
      width: 70,
      align: 'center',
    },
    {
      title: '用户名',
      key: 'account',
      editableUpdate: (row, value, index) => {
        log.debug(row, `修改后的值：${value}, 索引：${index}`)
        row.account = value
        window.$message.success(`修改了用户名：${value}`)
      },
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '邮箱',
      key: 'email',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      key: 'status',
      width: 80,
      title: '状态',
      filterMultiple: false,
      defaultFilterOptionValue: 0,
      filterOptions: [
        {
          label: '全部状态',
          value: 0,
        },
        {
          label: '正常使用中',
          value: 1,
        },
        {
          label: '已禁止使用',
          value: 2,
        },
      ],
      filter: true,
      render(rowData) {
        const v: { [key: string]: any } = {
          title: '禁用',
          props: {
            size: 'small',
          },
        }
        if (rowData.status === 1) {
          v.title = '正常'
          v.props.type = 'success'
        }

        return h(NTag, v.props, { default: () => v.title })
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

  setProps({
    'onUpdate:filters': (filters: { [key: string]: any }) => {
      window.$message.success(`点击了过滤状态：${filters.status}`)
      run(filters.status ? filters : {})
    },
  })

  return { ...table, showFilterDrawer }
}
