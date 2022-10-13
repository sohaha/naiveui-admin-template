import { PieChart } from 'echarts/charts'
import { TimelineComponent } from 'echarts/components'
import { use } from 'echarts/core'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import 'vue-echarts'
use(PieChart)
use(TimelineComponent)

export const optionPieRose = ref<ECBasicOption>({
  baseOption: {
    title: {
      text: '基础南丁格尔玫瑰图',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 150],
        center: ['50%', '50%'],
        roseType: 'area',
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' },
        ],
      },
    ],
  },
})
