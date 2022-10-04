<script lang="ts" setup>
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'

const { isDark } = useDarks()
const theme = themeStore()
const { language, t } = useLanguage()
const isZhCN = computed(() => language.value === '中文')
const uiLocale = computed(() => (isZhCN.value ? zhCN : enUS))
const dateLocale = computed(() => (isZhCN.value ? dateZhCN : dateEnUS))
const state = stateStore()
</script>

<template>
  <NConfigProvider
    preflight-style-disabled
    :date-locale="dateLocale"
    :locale="uiLocale"
    :theme-overrides="theme.getBaseTheme"
    :theme="isDark ? theme.darkTheme : null"
  >
    <NLoadingBarProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NDialogProvider>
            <NSpin :show="!!state.loadingMsg">
              <slot />
              <LayoutLoadingContent />
              <template #description>
                {{ state.loadingMsg }}
              </template>
            </NSpin>
          </NDialogProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style scoped></style>
