import { type InjectionKey, type Ref, inject, onBeforeUnmount } from 'vue'

import { type UseStore, type Window } from './store'

export const injectionKey: InjectionKey<{
  window: Ref<Window>
  store: ReturnType<UseStore>
}> = Symbol('multi-window')

export const baseComponentKey = Symbol('base-component')

export function getCurrentWindow(): Window {
  const _inject = inject(injectionKey)

  if (!_inject || !_inject.store)
    console.warn('不是多窗口组件页面')
  // return null

  const route = useRoute()
  return _inject!.store.findWindowByFullPath(route.fullPath)!
}

export function onRefresh(callback: any) {
  const window = getCurrentWindow()
  if (!window)
    return () => null

  const { refreshCallback } = window

  refreshCallback.push(callback)

  function removeEvent() {
    console.time('removeEvent')
    const index = refreshCallback.indexOf(callback)
    if (index > -1)
      refreshCallback.splice(index, 1)
    console.timeEnd('removeEvent')
  }

  onBeforeUnmount(() => removeEvent())

  return removeEvent
}
