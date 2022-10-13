<script lang="ts" setup>
import VChart from '@/components/VChart'
import { initOptionBar, optionBar } from '@/components/VChart/example/bar-data'
import { optionLine } from '@/components/VChart/example/line-data'
import { optionPie } from '@/components/VChart/example/pie-data'
import { optionPieRose } from '@/components/VChart/example/pie-rose-data'
</script>

<template>
  <CardRows>
    <Card>
      文档：
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
      <VChart :init-options="initOptionBar" class="h-[400px]" :option="optionBar" />
      <VChart :loading="true" class="h-[400px]" :option="optionLine" />
      <VChart class="h-[400px]" :option="optionPie" />
      <Card class="col-span-auto  xl:col-span-3">
        <VChart class="h-[300px]" :option="optionPieRose" />
      </Card>
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
