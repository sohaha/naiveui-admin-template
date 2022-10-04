<script lang="ts" setup>
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const optionBar = ref({
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

const optionLine = ref({
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

const optionPie = ref({
  title: {
    text: '饼状图',
    subtext: 'Fake Data',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

// 设置主题
const { isDark } = useDarks()
const theme = computed(() => {
  return isDark.value ? 'dark' : ''
})
provide(THEME_KEY, theme)
</script>

<template>
  <CardRows>
    <Card>
      文档：
      <NButton
        text
        tag="a"
        href="https://github.com/ecomfe/vue-echarts/blob/main/README.zh-Hans.md"
        target="_blank"
        type="primary"
        rel="noopener"
      >
        使用方式
      </NButton> |
      <NButton
        text
        tag="a"
        href="https://echarts.apache.org/examples/zh/index.html"
        target="_blank"
        type="primary"
        rel="noopener"
      >
        示例图表
      </NButton>
    </Card>
    <CardCols class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <VChart :autoresize="true" class="h-[400px]" :option="optionBar" />
      <VChart :autoresize="true" class="h-[400px]" :option="optionLine" />
      <VChart :autoresize="true" class="h-[400px]" :option="optionPie" />
    </CardCols>
  </CardRows>
</template>

<style scoped>
</style>

<route lang="json">
{
  "meta": {
    "icon": "i-bx:bar-chart-square",
    "title": "Echarts"
  }
}
</route>
