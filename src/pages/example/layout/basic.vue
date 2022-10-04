<script lang="ts" setup>
const { t } = useLanguage()

const height = ref(false)

const toggle = () => {
  height.value = !height.value
}

const state = stateStore()
const fullHeight = computed(() => {
  return `${state.getPageContentHeight}px`
})
</script>

<template>
  <Card :height="height">
    <NButton @click="toggle">
      切换满屏
    </NButton>
    {{ t('header') }}
  </Card>
</template>

<style scoped></style>

<route lang="json">
{ "meta": { "i18n": { "en": "Basics", "zh": "基础布局" } } }
</route>

<i18n lang="json">
{
  "en": {
    "header": "This is a simple page."
  },
  "zh": {
    "header": "这是一个简单的页面。"
  }
}
</i18n>
