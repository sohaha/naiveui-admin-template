import { type AsyncComponentLoader, KeepAlive, h, provide } from 'vue'
import { type RouteRecordRaw, onBeforeRouteUpdate } from 'vue-router'
import Loading from '../Loading'
import { type UseStore } from './store'
import { baseComponentKey, injectionKey } from '.'

export function createMultiWindowComponentWrap(
  routeRaw: RouteRecordRaw,
  useStore: UseStore,
) {
  if (!routeRaw.component)
    return

  if (!routeRaw.meta)
    routeRaw.meta = {}
  routeRaw.meta[baseComponentKey] = defineAsyncComponent(
    {
      loader: routeRaw.component as AsyncComponentLoader,
      delay: 0,
      // timeout: 240000,
      loadingComponent: Loading,
    },
  )

  const name = routeRaw.name as string

  /* eslint-disable vue/one-component-per-file */
  routeRaw.component = defineComponent({
    name,
    setup() {
      const route = useRoute()
      const store = useStore()
      const { openWindow } = store
      const currentWindow = ref(openWindow(route))

      onActivated(async () => {
        currentWindow.value = openWindow(route)
      })

      onBeforeRouteUpdate((to) => {
        watchOnce(
          () => route.fullPath,
          (fullPath: string) => {
            if (fullPath === to.fullPath)
              currentWindow.value = openWindow(to)
          },
        )
      })

      const keepAliveInclude = computed(() => {
        return store.windows
          .filter(window => window.componentName === name)
          .map(window => `${window.fullPath}-${window.refreshKey}`)
      })

      provide(injectionKey, {
        window: currentWindow,
        store,
      })

      return () => {
        const { component } = currentWindow.value
        if (!component)
          return null

        return h(
          KeepAlive,
          {
            include: keepAliveInclude.value,
          }, h(component),
        )
      }
    },
  })
}

function createUseStore(useStore: UseStore): UseStore {
  let store: ReturnType<UseStore>
  return () => {
    if (!store)
      store = useStore()
    return store
  }
}

export function setupMultiWindow(routes: RouteRecordRaw[], useStore: any): any {
  const useStoreProxy = createUseStore(useStore)
  routes.forEach((route) => {
    if (route.path !== '/' && route.children) {
      route.children.forEach((r) => {
        const meta = r.meta || {}
        const { layout = 'Home', multiWindow = true } = meta
        meta.multiWindow = multiWindow
        r.meta = meta
        if (multiWindow && layout === 'Home') { createMultiWindowComponentWrap(r, useStoreProxy) }
        else {
          const component = r.component
          if (component) {
            r.component = defineComponent({
              render() {
                return h('div', { class: 'not-keep' }, h(defineAsyncComponent({
                  loader: component as AsyncComponentLoader,
                })))
              },
            })
          }
        }
      })
    }
  })
}
