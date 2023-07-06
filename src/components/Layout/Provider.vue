<script lang="ts" setup>
import { dateEnUS, dateZhCN, enUS, useThemeVars, zhCN } from 'naive-ui'

const { isDark } = useDarks()
const theme = themeStore()
const { language, t } = useLanguage()
const isZhCN = computed(() => language.value === '中文')
const uiLocale = computed(() => (isZhCN.value ? zhCN : enUS))
const dateLocale = computed(() => (isZhCN.value ? dateZhCN : dateEnUS))
const state = stateStore()

const layoutRef = ref()
const themeVars = useThemeVars()
const borderRadius = useCssVar('--n-border-radius', layoutRef)
watch(themeVars, (r) => {
  borderRadius.value = r.borderRadius
}, { immediate: true })
</script>

<template>
  <NConfigProvider
    ref="layoutRef"
    preflight-style-disabled
    :date-locale="dateLocale"
    :locale="uiLocale"
    :theme-overrides="theme.getBaseTheme"
    :theme="isDark ? theme.darkTheme : null"
  >
    <NLoadingBarProvider>
      <!-- <NGlobalStyle /> -->
      <NMessageProvider :max="5">
        <NNotificationProvider :max="8" placement="bottom-right">
          <NDialogProvider>
            <div embedded>
              <NSpin :class="state.loadingMsg && 'bg-black bg-opacity-20'" :show="!!state.loadingMsg">
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
