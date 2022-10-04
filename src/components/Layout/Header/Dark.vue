<script lang="ts" setup>
const { t } = useLanguage()
const { isDark, toggleDark } = useDarks()

// TODO 做一些小效果
// const state = stateStore()
// const { start, ready } = useTimeout(300, { controls: true })
// watch(ready, (v) => {
//   state.setLoadingMsg(!v ? (isDark ? t('toggle_light') : t('toggle_dark')) : '')
// })

// const source = ref([0, 0, 0])
// const output = useTransition(source)
// const color = computed(() => {
//   const [r, g, b] = output.value
//   return `rgb(${r}, ${g}, ${b})`
// })

function toggle() {
  // start()
  toggleDark()
}
</script>

<template>
  <NTooltip>
    <template #trigger>
      <NButton class="px-2" text @click="toggle">
        <NIcon size="20" :class="isDark ? 'i-bx:bxs-moon' : 'i-bx:bxs-sun'" />
      </NButton>
    </template>
    {{ isDark ? t('toggle_light') : t('toggle_dark') }}
  </NTooltip>
</template>

<i18n lang="yml">
en:
  toggle_light: Toggle Light mode
  toggle_dark: Toggle Dark mode
zh:
  toggle_dark: 切换深色模式
  toggle_light: 切换浅色模式
</i18n>
