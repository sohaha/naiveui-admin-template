import { defineStore } from 'pinia'

type themeOptions = 'dark' | 'light'

export default defineStore('settingStore', {
  state() {
    return {
      theme: {
        PrimaryColor: '#54b6fc',
      },
      menu: {
        collapsed: false,
        indent: 4,
        rootIndent: 26,
        theme: 'light' as themeOptions,
      },
    }
  },
  actions: {
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
  },
  persist: true,
})
