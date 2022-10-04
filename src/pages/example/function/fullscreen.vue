<script setup lang="ts">
const { toggle } = useWindowFullscreen()
</script>

<template>
  <div class="p-4 h-full bg-[var(--a-bg-color)] ">
    <Card>
      <NButton @click="toggle">
        切换满屏
      </NButton>
    </Card>
  </div>
</template>

<style>

</style>

<route lang="json">
{
  "meta": {
    "i18n": {
      "zh": "切换全屏",
      "en": "Fullscreen"
    },
    "layout": "Empty",
    "fullscreen": true
  }
}
</route>
