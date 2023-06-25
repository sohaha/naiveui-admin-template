<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'

multiWindowStore()

// const { mergeSettings } = settingStore()

// apiSettings().then((e) => {
//   mergeSettings(e)
// })
</script>

<template>
  <LayoutProvider>
    <RouterView />
  </LayoutProvider>
</template>
