import { NIcon, NTooltip } from 'naive-ui'
import type { VNode } from 'vue'

export function renderTooltip(
  trigger: VNode | string,
  content: VNode | string,
) {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}

export function renderIcon(icon: any, size?: number) {
  let props: any = size ? { size } : {}
  const isClassIcon = typeof icon === 'string'
  if (isClassIcon)
    props = { ...props, class: icon }

  return () => {
    return h(NIcon, props, {
      default: () => (isClassIcon ? h(icon) : null),
    })
  }
}
