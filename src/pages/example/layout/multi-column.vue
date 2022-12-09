<script lang="ts" setup>
const { t, language } = useLanguage()

const dynamicBoxs = ref(0)

const interval = setInterval(() => {
  dynamicBoxs.value++
}, 200)
</script>

<template>
  <CardCols class="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ">
    <Card class="col-span-auto" title="区块标题">
      动态区块 : {{ dynamicBoxs }}
    </Card>

    文本内容区域 : {{ t('hello') }} / {{ language }}

    <div>
      内容区域 : {{ t('hello') }} / {{ language }}
    </div>

    <Card class="col-span-1 md:col-span-3 lg:col-span-2 whitespace-nowrap">
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

    <Card :bordered="false">
      无阴影
    </Card>

    <TransitionGroup name="list">
      <Card v-for="(v) in dynamicBoxs" :key="v">
        内容区域 : {{ v }}
      </Card>
    </TransitionGroup>
  </CardCols>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

<route lang="yaml">
meta:
  multiWindow: false
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
