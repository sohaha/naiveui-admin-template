<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: number
}>(), { size: 20 })

const { t } = useLanguage()
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NButton type="error" class="px-2" text>
        <NIcon :size="props.size" class="animate-pulse i-bx-wifi-off" />
      </NButton>
    </template>
    {{ t('tip') }}
  </NTooltip>
</template>

<i18n lang="yml">
en:
  tip: Network disconnection

zh:
  tip: 网络断开
</i18n>
