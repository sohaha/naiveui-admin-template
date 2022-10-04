<script lang="ts" setup>
import { format } from 'date-fns'

const now = useNow()
const nowTime = computed(() => format(now.value, 'yyyy-MM-dd HH:mm:ss'))

const user = userStore()
const hi = computed(() => {
  const now = new Date()
  const hour = now.getHours()
  let text
  switch (true) {
    case hour < 6:
      text = '凌晨好'
      break
    case hour < 9:
      text = '早上好'
      break
    case hour < 12:
      text = '上午好'
      break
    case hour < 14:
      text = '中午好'
      break
    case hour < 17:
      text = '下午好'
      break
    case hour < 19:
      text = '傍晚好'
      break
    case hour < 22:
      text = '晚上好'
      break
    default:
      text = '深夜好'
  }

  return `${text}，${user.getNickName}！`
})
</script>

<template>
  <Card height class="text-center">
    <div
      class="flex h-full item-center justify-center flex-col text-3xl space-y-5"
    >
      <span> <NIcon class="mi-twemoji-timer-clock" size="60" /></span>
      <span>{{ hi }}</span>
      <span> {{ nowTime }}</span>
    </div>
  </Card>
</template>

<style scoped>
.mi-twemoji-timer-clock {
  background: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 36 36' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%23AAB8C2' d='M18 0C8.611 0 1 7.611 1 17h.029v17c0 1.1.9 2 2 2H33c1.1 0 2-.9 2-2V17c0-9.389-7.611-17-17-17z'/%3E%3Ccircle cx='18' cy='17' r='14' fill='%23FFF'/%3E%3Cpath fill='%2366757F' d='M18 4c7.18 0 13 5.82 13 13s-5.82 13-13 13S5 24.18 5 17S10.82 4 18 4m0-2C9.729 2 3 8.729 3 17s6.729 15 15 15s15-6.729 15-15S26.271 2 18 2z'/%3E%3Cpath fill='%23292F33' d='M19 6a1 1 0 0 0-2 0v1a1 1 0 0 0 2 0V6zm0 21a1 1 0 0 0-2 0v1a1 1 0 0 0 2 0v-1zM8 16H7a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm21 0h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm-2.293 8.293L26 23.586A.999.999 0 1 0 24.586 25l.707.707a.999.999 0 1 0 1.414-1.414zM10 23.586l-.707.707a.999.999 0 1 0 1.414 1.414l.707-.707A.999.999 0 1 0 10 23.586zM9.293 9.707l.707.707A.999.999 0 1 0 11.414 9l-.707-.707a.999.999 0 1 0-1.414 1.414zM26 10.414l.707-.707a.999.999 0 1 0-1.414-1.414L24.586 9A.999.999 0 1 0 26 10.414z'/%3E%3Cpath fill='%23DD2E44' d='M8.915 13.839a1 1 0 0 1 1.325-1.288l8.154 3.51a1 1 0 0 1-.791 1.837l-8.154-3.51a1 1 0 0 1-.534-.549z'/%3E%3C/svg%3E")
    no-repeat;
}
</style>

<route lang="json">
{
  "meta": {
    "i18n": {
      "en": "Dashboard",
      "zh": "仪表面板"
    }
  }
}
</route>
