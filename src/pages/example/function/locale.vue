<script lang="ts" setup>
const { t, locale, toggleLocale } = useLanguage()
</script>

<template>
  <Card>
    <div class="space-y-3">
      <div>
        内容 : {{ t('hello') }} | {{ t('not_found') }} |
        {{ t('login.title') }}
      </div>
      <div>当前语言 : {{ locale }}</div>
      <div class="flex-initial space-x-2">
        <NButton size="small" type="info" @click="toggleLocale('zh')">
          指定中文
        </NButton>
        <NButton size="small" type="warning" @click="toggleLocale('en')">
          Assign English
        </NButton>
        <NButton size="small" type="primary" @click="toggleLocale()">
          {{ t('toggle') }}
        </NButton>
      </div>
    </div>
  </Card>
</template>

<route lang="yaml">
meta:
  i18n:
    en: Localization
    zh: 多语言包
</route>

<i18n lang="yml">
en:
  hello: Hello
  toggle: Toggle
  login.title: Login (overwrite global language pack)
  not_found: Not Found (New)
  header: This is a simple page.
zh:
  hello: 你好
  toggle: 切换
  login.title: 登录 (覆盖全局语言包)
  not_found: 没有找到 (新)
  header: 这是一个简单的页面。
</i18n>
