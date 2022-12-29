import { isObject } from '@vueuse/core'
import { type Component, computed, defineComponent, h, markRaw, reactive } from 'vue'
import { type RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { baseComponentKey } from '.'
import { locale } from '~/modules/i18n'

const appName = (import.meta.env.VITE_APP_TITLE || 'ZlsAPP') as string

export interface Window {
  key: string
  path: string
  fullPath: string
  name: string | null
  meta: any
  scrollTop: number
  scrollLeft: number
  refreshKey: number
  refreshCallback: any
  componentName: string
  component?: Component
  baseComponent?: Component
  close: () => void
  refresh: () => void
  rename: (name: string) => {}
}

export default function useStore() {
  const { t } = useLanguage()
  const router = useRouter()
  const route = useRoute()

  const lastWindow = ref<Window>()
  const windows = reactive<Window[]>([])

  const currentWindow = computed(() => {
    return findWindowByFullPath(route.fullPath)
  })
  const windowTab = computed(() => {
    const tabs = windows.map((item) => {
      return {
        fullPath: item.fullPath,
        meta: item.meta,
        name: item.name,
      }
    })
    if (!currentWindow.value && route.fullPath !== '/load') {
      tabs.push({
        meta: route.meta,
        name: '',
        fullPath: route.fullPath,
      })
    }
    return tabs
  })

  // const windowsStore = usePrefixStorage<Window[]>('windows-store', [])

  // onMounted(() => {
  //   watch(windows, (w) => {
  //     windowsStore.value = w.map((item) => {
  //       return {
  //         name: item.name,
  //         meta: item.meta,
  //         fullPath: item.fullPath,
  //         componentName: item.componentName,
  //       } as Window
  //     })
  //   })
  // })

  watch(currentWindow, (n, old) => {
    lastWindow.value = old
  })

  let localI18n: boolean | object = false
  let localTitle = ''
  const title = ref(
    viewTitle(route?.meta?.title as string, route?.meta?.i18n as boolean),
  )

  watch(
    () => route.fullPath,
    () => {
      nextTick(updateTitle)
    },
  )
  setTimeout(updateTitle, 1000)

  function updateTitle(t?: string) {
    if (t !== undefined) {
      title.value = viewTitle(t as string, localI18n)
      return
    }

    let wt = currentWindow.value?.name || ''
    let i = false
    if (!wt) {
      wt = route?.meta?.title as string
      i = route?.meta?.i18n as boolean
    }
    else {
      i = currentWindow.value?.meta?.i18n as boolean
    }

    title.value = viewTitle(wt as string, i)
  }

  function viewTitle(title: string, i18n: boolean | object = false) {
    localTitle = title
    localI18n = i18n
    if (i18n) {
      if (isObject(i18n))
        title = (i18n as any)[locale.value] || title
      else if (title)
        title = t(title)
    }

    return title ? `${title} - ${appName}` : appName
  }

  watch(locale, () => {
    if (localI18n) {
      nextTick(() => {
        title.value = viewTitle(localTitle, localI18n)
      })
    }
  })

  // const title = computed(() => {
  //  return currentWindow.value
  //   ? `${currentWindow.value.name} - ${appName}`
  //   : appName
  // })

  useTitle(title)

  function findWindow(windowOrKey: Window | string) {
    const key = typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key
    return windows.find(item => item.key === key)
  }

  function findWindowByFullPath(fullPath: string) {
    return windows.find(item => item.fullPath === fullPath)
  }

  function findWindowByComponentName(componentName: string) {
    return windows.find(item => item.componentName === componentName)
  }

  function findWindowIndex(windowOrKey: Window | string) {
    const key = typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key
    return windows.findIndex(item => item.key === key)
  }

  function hasCurrentWindow(windowOrKey: Window | string) {
    const current = currentWindow.value
    if (!current)
      return false

    const key = typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key

    return key === current.key
  }

  function switchWindow(windowOrKey: Window | string) {
    const window = findWindow(windowOrKey)!

    if (!window)
      return
    if (route.fullPath !== window?.fullPath)
      router.push(window!.fullPath)

    return findWindowByFullPath(window.fullPath)
  }

  function createWindowComponent(window: Window) {
    window.component = markRaw(
      defineComponent({
        name: `${window.fullPath}-${window.refreshKey}`,
        setup() {
          const scroll$ = ref<any>()

          onActivated(() => {
            const { scrollTop, scrollLeft } = window
            scroll$.value?.scrollTo({
              top: scrollTop,
              left: scrollLeft,
            })
          })

          return () =>
            h(
              'div',
              {
                ref: (ref: any) => (scroll$.value = ref),
                onScroll({ scrollLeft, scrollTop }: any) {
                  window.scrollTop = scrollTop
                  window.scrollLeft = scrollLeft
                },
              },
              h(window.baseComponent!),
            )
        },
      }),
    )
  }

  function createWindow(to: RouteLocationNormalizedLoaded) {
    const { path, fullPath, meta, name } = to
    const key = `${fullPath}-${Date.now().toString()}`
    const window = reactive({
      key,
      path,
      fullPath,
      meta,
      name: typeof meta.title === 'string' ? meta.title : name || '<未命名>',
      scrollTop: 0,
      scrollLeft: 0,
      refreshKey: 1,
      refreshCallback: [],
      componentName: route.name as string,
      baseComponent: markRaw(meta[baseComponentKey] as Component),
      close() {
        closeWindow(key)
      },
      refresh() {
        refreshWindow(key)
      },
      rename(name: string, meta?: any) {
        if (isObject(name))
          windowRename(key, '', name)
        else windowRename(key, name, meta)
      },
    }) as any

    // if (lastWindow.value)
    //  windows.splice(findWindowIndex(lastWindow.value) + 1, 0, window)
    // else windows.push(window)
    windows.push(window)

    // const window = windows[windows.length - 1]
    createWindowComponent(window)

    return window
  }

  function openWindow(to: RouteLocationNormalizedLoaded) {
    const window
      = windows.find(item => item.path === to.path) || createWindow(to)

    return switchWindow(window)!
  }

  function closeWindow(windowOrKey: Window | string) {
    // const l = windows.length
    // TODO dev 禁止关闭全部？
    // if (l === 1) {
    //   return
    // }

    const index = findWindowIndex(windowOrKey)

    if (hasCurrentWindow(windowOrKey)) {
      const next = windows[index + 1] || windows[index - 1]
      if (next)
        router.push(next.path)
      else
        router.push('/')
    }

    windows.splice(index, 1)
  }

  function closeTab(fullPath: string) {
    console.time('closeTab')
    const w = findWindowByFullPath(fullPath)
    if (!w) {
      if (route.fullPath === fullPath) {
        const last = windowTab.value[windowTab.value.length - 2]

        last && router.push(last.fullPath)
      }

      return
    }
    w.close()

    console.timeEnd('closeTab')
  }

  function closeWindowForOther(
    window = currentWindow.value,
    command = 'other',
  ) {
    if (!window)
      return

    if (!hasCurrentWindow(window))
      switchWindow(window)

    const index = findWindowIndex(window)

    switch (command) {
      case 'other':
        windows.splice(0, windows.length, window)
        break
      case 'left':
        windows.splice(0, index)
        break
      case 'right':
        windows.splice(index + 1, windows.length - index - 1)
        break
    }
  }

  function closeTabForOther() {
    const w = findWindowByFullPath(route.fullPath)
    if (!w) {
      windows.splice(0, windows.length)
      return
    }
    closeWindowForOther(w)
  }

  function refreshWindow(windowOrKey: Window | string) {
    const window = findWindow(
      typeof windowOrKey === 'string' ? windowOrKey : windowOrKey.key,
    )
    if (window) {
      const runStep = (i = 0) => {
        if (window.refreshCallback && window.refreshCallback[i]) {
          window.refreshCallback[i](() => runStep(i + 1))
        }
        else {
          window.refreshKey++
          createWindowComponent(window)
        }
      }
      runStep()
    }
  }

  function windowRename(windowOrKey: Window | string, name: string, meta?: any) {
    const window = findWindow(windowOrKey)
    if (window) {
      name && (window.name = name)
      window.meta = { ...window.meta, title: null, i18n: null, ...meta }
      updateTitle()
    }
  }

  return {
    currentWindow,
    windows,
    windowTab,
    hasCurrentWindow,
    findWindow,
    findWindowByFullPath,
    findWindowByComponentName,
    findWindowIndex,
    switchWindow,
    createWindow,
    openWindow,
    closeWindow,
    closeTab,
    closeWindowForOther,
    closeTabForOther,
    refreshWindow,
    windowRename,
    lastWindow,
    updateTitle,
  }
}

export type UseStore = typeof useStore
