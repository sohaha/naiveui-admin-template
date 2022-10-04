<script lang="ts" setup>
const { t, language } = useLanguage()
</script>

<template>
  <CardCols
    class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
  >
    <Card title="这是一个区块">
      内容区域 : {{ t('hello') }} / {{ language }}
    </Card>
    内容区域 : {{ t('hello') }} / {{ language }}
    <div> 内容区域 : {{ t('hello') }} / {{ language }} </div>
    <Card
      class="col-span-auto md:col-span-3 lg:col-span-2"
    >
      <div class="flex justify-between">
        <span>自适应</span>
        <div class="flex items-center gap-x-3 text-base text-light-emphasis">
          <i class="cursor-pointer i-bx-chevron-down" />
          <i class="cursor-pointer i-bx-refresh" />
          <i class="cursor-pointer i-bx-x" />
        </div>
      </div>
      640px 占用 3；1024px 占用 2
    </Card>

    <Card v-for="i in 15" :key="i">
      内容区域 : {{ t('hello') }} / {{ language }}
    </Card>
  </CardCols>
</template>

<style scoped></style>

<route lang="yaml">
meta:
  i18n:
    en: Column
    zh: 多列布局
</route>

<i18n lang="yml">
en:
  hello: Hello
  header: This is a simple page.
zh:
  hello: 你好
  header: 这是一个简单的页面。
</i18n>
