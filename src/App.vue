<script lang="ts" setup>
const { mergeSettings } = settingStore()

apiSettings().then((e) => {
  mergeSettings(e)
})

multiWindowStore()

lock.lockWrite()
useRequest(apiSite, {
  onBefore(v) {
    const loading = document.querySelector('#loading') as HTMLElement
    if (loading) {
      const title: any = loading.querySelector('.sub-title') as HTMLElement
      title.innerText = '请稍作等待，马上加载完毕'
    }
    return v
  },
  onAfter(v) {
    lock.unlockWrite()
    if (import.meta.env.SSR)
      return v
    const loading = document.querySelector('#loading') as HTMLElement
    loading
    && setTimeout(() => {
      loading.style.opacity = '0.02'
      setTimeout(() => document.body.removeChild(loading), 600)
    })
    return v
  },
  onSuccess(v) {

  },
})
</script>

<template>
  <LayoutProvider>
    <RouterView />
  </LayoutProvider>
</template>
