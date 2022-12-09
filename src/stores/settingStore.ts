import { defineStore } from 'pinia'

type themeOptions = 'dark' | 'light'

export default defineStore('settingStore', {
  state() {
    return {
      theme: {
        PrimaryColor: '#1a546f', // #db3327 , #54b6fc
      },
      layout: {
        maxWidth: '',
      },
      menu: {
        collapsed: true,
        indent: 4,
        rootIndent: 26,
        theme: 'light' as themeOptions,
      },
    }
  },
  actions: {
    mergeSettings(e: { [key: string]: any }) {
      Object.keys(e).forEach((key: any) => {
        // @ts-expect-error
        if (typeof this[key] === 'object')
        // @ts-expect-error
          Object.assign(this[key], e[key])
        else
        // @ts-expect-error
          this[key] = e[key]
      })
    },
    toggleCollapsed(s?: boolean) {
      if (s !== undefined) {
        this.menu.collapsed = s
        return
      }
      this.menu.collapsed = !this.menu.collapsed
    },
  },
  getters: {
    isCollapsed(): boolean {
      return this.menu.collapsed
    },
    isMenuInverted(): boolean {
      return this.menu.theme === 'dark'
    },
    getMaxWidth(): string {
      return this.layout.maxWidth || ''
    },
  },
  persist: true,
})
