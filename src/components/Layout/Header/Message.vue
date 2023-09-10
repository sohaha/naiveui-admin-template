<script lang="ts" setup>
import type { InstApi } from '@/types/global'

const props = withDefaults(defineProps<{
  size?: number
}>(), { size: 20 })

const state = stateStore()

useRequest(apiHeartbeat, {
  pollingInterval: 30000,
  pollingWhenHidden: true,
  refreshOnWindowFocus: true,
  refocusTimespan: 2000,
  onSuccess(v: InstApi) {
    if (v.code === 0)
      state.setUnreadMessage(v.data.unread)
  },
  onError(e: Error | null) {
    if (e)
      console.error(e)
  },
})

const router = useRouter()
function goMessagePage() {
  router.push(`/inlay/message?_v=${Date.now()}`)
}
</script>

<template>
  <NButton v-if="state.unreadMessage" class="px-2" text @click="goMessagePage">
    <NBadge dot :value="state.unreadMessage" :max="10">
      <NIcon :size="props.size" class="i-bx:mail-send" />
    </NBadge>
  </NButton>
</template>

<style scoped>
:deep(.n-badge-sup) {
  height: 12px;
  line-height: 12px;
  padding: 0 3px;
  top: -10%;
}
</style>
