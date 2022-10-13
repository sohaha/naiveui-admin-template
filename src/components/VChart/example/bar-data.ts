import 'vue-echarts'

import { BarChart } from 'echarts/charts'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import type { ECBasicOption } from 'echarts/types/dist/shared'

use(BarChart)

// 使用 SVG 渲染器
use(SVGRenderer)

export const initOptionBar = { renderer: 'svg' }
export const optionBar = ref<ECBasicOption>({
  title: {
    text: '柱状图',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Bar Sources',
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
  ],
})
