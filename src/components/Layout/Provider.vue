<script lang="ts" setup>
import { dateEnUS, dateZhCN, enUS, useThemeVars, zhCN } from 'naive-ui'

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
      <!-- <NGlobalStyle /> -->
      <NMessageProvider>
        <NNotificationProvider>
          <NDialogProvider>
            <div :bordered="false" embedded>
              <NSpin :class="state.loadingMsg && 'bg-black'" :show="!!state.loadingMsg">
                <template #icon>
                  <NIcon />
                </template>
                <slot />
                <LayoutLoadingContent />
                <template #description>
                  <div class="text-white">
                    {{ state.loadingMsg }}
                  </div>
                </template>
              </NSpin>
            </div>
          </NDialogProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style scoped></style>
