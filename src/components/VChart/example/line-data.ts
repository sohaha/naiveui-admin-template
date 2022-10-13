import { LineChart } from 'echarts/charts'
import { use } from 'echarts/core'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import 'vue-echarts'
use(LineChart)

export const optionLine = ref<ECBasicOption>({
  title: {
    text: '折线图',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {},
    },
  ],
})
