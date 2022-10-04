<script lang="ts" setup>
const { t, toggleLocale } = useLanguage()
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NButton class="px-2" text @click="() => toggleLocale()">
        <NIcon size="20" class="i-bx:world" />
      </NButton>
    </template>
    {{ t('tip') }}
  </NTooltip>
</template>

<i18n lang="yml">
en:
  tip: Toggle locales

zh:
  tip: 切换语言
</i18n>
