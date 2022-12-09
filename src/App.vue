<script lang="ts" setup>
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
