import { format } from 'date-fns'

const now = useNow()
const nowTime = computed(() => format(now.value, 'yyyy-MM-dd HH:mm:ss'))

const time = computed(() => format(now.value, 'HH:mm:ss'))

const say = computed(() => {
  const hour = now.value.getHours()
  let text = '早点休息吧！'

  switch (true) {
    case (hour >= 0) && (hour < 7):
      text = '注意休息哦！'
      break
    case (hour >= 7) && (hour < 12):
      text = '美好的一天！'
      break
    case (hour >= 12) && (hour < 14):
      text = '午休咯！'
      break
    case (hour >= 14) && (hour < 18):
      text = '努力加油！'
      break
    case (hour >= 18) && (hour <= 22):
      text = '放松一下吧！'
      break
  }

  return `${text}`
})

const ask = computed(() => {
  const hour = now.value.getHours()
  let text = '深夜好'
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
  }

  return `${text}`
})

export default () => {
  return { nowTime, time, say, ask }
}
