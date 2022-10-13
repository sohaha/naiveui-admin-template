import { isObject } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { StMenu } from '@/types/global'

const isSmallScreen = useMediaQuery('(max-width: 640px)')
const { height } = useWindowSize()

const defPageHeaderHeight = 33 + 16
export default defineStore('stateStore', {
  state() {
    return {
      loadingMsg: '',
      pageHeaderHeight: defPageHeaderHeight,
      unreadMessage: 0,
      memu: [],
    }
  },
  getters: {
    getPageContentHeight(): number {
      return height.value - this.pageHeaderHeight - 16 * 2
    },
    isSmallScreen() {
      return isSmallScreen.value
    },
    getMemu(): StMenu[] {
      return this.memu
    },
  },
  actions: {
    toTitle(meta?: { [key: string]: any }) {
      const { locale, t } = useI18n()
      let title = ''
      if (!meta) {
        const route = useRoute()
        meta = route?.meta || {}
      }
      const i18n: undefined = meta?.i18n as any
      if (i18n) {
        if (isObject(i18n))
          title = i18n[locale.value] || title
        else title = meta.i18n ? t(meta.title) : meta.title
      }
      if (!title && meta.title)
        title = meta.title

      return title
    },
    setPageHeaderHeight(h?: number) {
      if (h === undefined) {
        this.pageHeaderHeight = defPageHeaderHeight
        return
      }
      this.pageHeaderHeight = h
    },
    setLoadingMsg(msg: string) {
      this.loadingMsg = msg
    },
    setUnreadMessage(i: number) {
      this.unreadMessage = i
    },
    setMenu(m: any) {
      this.memu = m
    },
  },
  // persist: true,
})
