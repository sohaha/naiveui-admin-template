<script lang="ts" setup>
const { isOnline, isSupported } = useNetwork()
</script>

<template>
  <LayoutHeaderNetwork v-if="isSupported && !isOnline" />
  <LayoutHeaderMessage v-else />
</template>

<style scoped></style>
