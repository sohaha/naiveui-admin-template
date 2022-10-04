<script lang="ts" setup>
const items = [
  {
    title: 'naiveui',
    description: 'UI 组件库',
    link: 'https://www.naiveui.com/zh-CN/os-theme/components/button',
  },
  {
    title: 'vue-use-api',
    description: '数据请求 Hook 库',
    link: 'https://nook.notion.site/vue-use-api-d9409f64d788449285be4bc1956ff277',
  },
  {
    title: 'icones',
    description: 'SVG 图标库',
    help: '使用方式: &lt;div class="i-[tag]" /&gt;',
    link: 'https://icones.js.org/collection/bx',
  },
  {
    title: 'windicss',
    description: 'CSS 框架',
    link: 'https://cn.windicss.org/utilities/colors.html',
  },
]

function open(u: string) {
  openURL(u)
}
</script>

<template>
  <CardCols class="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    <Card v-for="v in items" :key="v.title" class="relative pb-10">
      <NThing>
        <template #header>
          {{ v.title }}
        </template>
        {{ v.description }}
        <!-- eslint-disable vue/no-v-html -->
        <code
          v-if="v.help"
          class="block mt-1 text-gray-500 text-xs"
          v-html="v.help"
        />
        <NButton
          dashed
          size="small"
          class="absolute bottom-4 right-4"
          @click="open(v.link)"
        >
          <template #icon>
            <NIcon class="i-bx:link" />
          </template>
          查看详情
        </NButton>
      </NThing>
    </Card>
  </CardCols>
</template>

<route lang="json">
{
  "meta": {
    "icon": "i-bx:detail",
    "i18n": {
      "en": "Readme",
      "zh": "示例说明"
    }
  }
}
</route>
