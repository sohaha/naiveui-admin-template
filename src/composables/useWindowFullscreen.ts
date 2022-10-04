import type { MaybeElementRef, UseFullscreenOptions } from '@vueuse/core'
import { useFullscreen } from '@vueuse/core'

export default (target?: MaybeElementRef | string | boolean, options?: UseFullscreenOptions) => {
  if (target && (typeof target === 'boolean' || typeof target === 'string')) {
    target = document.querySelector('#main-window') as HTMLElement
    if (!target)
      target = document.body
  }

  return useFullscreen(target as any, options)
}
