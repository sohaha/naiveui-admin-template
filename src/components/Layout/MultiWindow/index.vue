<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    transition?: string
    max?: number
  }>(),
  {
    max: 50,
    transition: 'fade-slide',
  },
)
const store = multiWindowStore()
const keepAliveInclude = computed(() =>
  store.windows.map(item => item.componentName),
)
</script>

<template>
  <template v-if="props.transition">
    <RouterView v-slot="{ Component: c }">
      <Transition appear :name="props.transition" mode="out-in">
        <KeepAlive :max="max" :include="keepAliveInclude">
          <Component :is="c" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </template>
  <template v-else>
    <RouterView v-slot="{ Component: c }">
      <KeepAlive :max="max" :include="keepAliveInclude">
        <Component :is="c" />
      </KeepAlive>
    </RouterView>
  </template>
</template>

<style scoped>
.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: transform .38s ease, opacity .35s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateZ(0) translateY(-60px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateZ(0) translateY(30px);
}
</style>
