<script lang="ts" setup>
const isDrawerShown = ref(false)
</script>

<template>
  <ADrawer
    v-model="isDrawerShown"
    title="Drawer title"
    subtitle="Chocolate cake tiramisu donut"
  />

  <AButton @click="isDrawerShown = true">
    Show drawer
  </AButton>
</template>

<route lang="json">
{
  "meta": {
    "icon": "i-bx:detail",
    "i18n": {
      "en": "Readme",
      "zh": "示例说明"
    }
  }
}
</route>
