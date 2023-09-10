<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: number
}>(), { size: 20 })

const { isOnline, isSupported } = useNetwork()
</script>

<template>
  <LayoutHeaderNetwork v-if="isSupported && !isOnline" :size="props.size" />
  <LayoutHeaderMessage v-else :size="props.size" />
</template>

<style scoped></style>
