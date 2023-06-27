export function useTable() {
  const table = useDataTable()

  // 表格配置
  const { setRowKey, setColumns, setRequest, setPagination, setToolbar, setAction } = table

  // 设置行主键
  setRowKey((row: any) => {
    return row.code + row.date + row.time
  })

  setPagination({ pageSizes: [10, 20, 30, 50, 100] })

  // 请求数据
  setRequest(yclh, {
    defaultParams: [{
      pagesize: 20,
    }],
  })

  // 工具栏
  setToolbar([])

  setAction(false)

  setColumns([
    {
      title: '编号',
      key: 'code',
      width: 70,
      align: 'center',
    },
    {
      title: '收盘',
      key: 'close',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '日期',
      key: 'date',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '预测',
      key: 'prediction',
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '时间',
      key: 'time',
      ellipsis: {
        tooltip: true,
      },
    },
  ])

  return { ...table }
}
