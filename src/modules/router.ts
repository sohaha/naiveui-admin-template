import { setupLayouts } from 'virtual:meta-layouts'
import type { App } from 'vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { setupMultiWindow } from '@/components/Layout/MultiWindow/setupMultiWindow'
import fileRoutes from '~pages'

const routes = setupLayouts(fileRoutes)

setupMultiWindow(routes, multiWindowStore)

export const router = createRouter({
  routes,
  history:
    import.meta.env.VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
})

export default (app: App) => {
  app.use(router)
}

let firstDone = false
const first = () => {
  firstDone = true
  if (import.meta.env.SSR)
    return
  const loading = document.querySelector('#loading') as HTMLElement
  loading
    && setTimeout(() => {
      loading.style.opacity = '0.05'
      setTimeout(() => document.body.removeChild(loading), 600)
    })
}

router.afterEach((v) => {
  if (import.meta.env.SSR || v.fullPath === '/reload')
    return

  nextTick(() => {
    window.$loading?.finish()
  })
  const meta = v?.meta || {}
  if (!firstDone) { first() }
  else if (meta?.fullscreen) {
    (() => {
      const { toggle, isFullscreen, isSupported } = useWindowFullscreen(meta.layout === 'Home' || meta.layout === undefined)
      if (!isSupported.value)
        return

      const toggleFullscreen = async () => {
        if (!isFullscreen.value)
          window.$state.setPageHeaderHeight(0)

        try {
          await toggle()
        }
        catch (e) {
        }
      }
      toggleFullscreen()
    })()
  }
})

// guards
router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    window.$loading?.start()
    const { getToken } = userStore()
    if (!getToken && to.name !== 'login') {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
      return
    }

    next()
  },
)
