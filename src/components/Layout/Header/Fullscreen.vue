<script lang="ts" setup>
const { t } = useLanguage()
const { isFullscreen, isSupported, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <NTooltip v-if="isSupported">
    <template #trigger>
      <NButton v-if="isSupported" class="px-2" text @click="toggleFullscreen">
        <NIcon
          size="20"
          :class="isFullscreen ? 'i-bx:exit-fullscreen' : 'i-bx:fullscreen'"
        />
      </NButton>
    </template>
    {{ isFullscreen ? t('fullscreen_exit') : t('fullscreen') }}
  </NTooltip>
</template>

<i18n lang="yml">
en:
  fullscreen: Toggle Fullscreen
  fullscreen_exit: Exit Fullscreen

zh:
  fullscreen: 切换全屏
  fullscreen_exit: 退出全屏
</i18n>
