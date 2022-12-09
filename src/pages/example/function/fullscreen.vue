<script setup lang="ts">
const { toggle } = useWindowFullscreen()

const router = useRouter()
function back() {
  router.back()
}
</script>

<template>
  <div class="p-3 h-full bg-[var(--a-bg-color)] ">
    <Card>
      <div class="space-x-3">
        <NButton @click="toggle">
          切换满屏
        </NButton>
        <NButton @click="back">
          返回
        </NButton>
      </div>
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
