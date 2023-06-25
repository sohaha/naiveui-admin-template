import exampleMenu from '@/pages/example/menu'
import type { StMenu } from '@/types/global'

const sessionToken = usePrefixStorage('token', '', sessionStorage)

const logged = ref(false)
const permission = ref<string[]>([])
const memu = ref<StMenu[]>([])
const user = ref<{ [key: string]: any }>({})
export default defineStore('user', {
  state() {
    return {
      keepLogin: true,
      token: '',
      aloneMenu: [] as StMenu[],
    }
  },
  getters: {
    getToken(): string {
      return this.keepLogin ? this.token : sessionToken.value
    },
    getNickName(): string {
      return user.value?.nickname || user.value?.username || ''
    },
    getAvatar(): string {
      return user.value?.avatar
    },
    getMemu(): StMenu[] {
      return memu.value || []
    },
    getAloneMenu(): StMenu[] {
      return this.aloneMenu || []
    },
    getAllMenu(): StMenu[] {
      return [...this.getMemu, ...this.getAloneMenu]
    },
    getUser(): { [key: string]: any } {
      return user.value
    },
    getPermission(): string[] {
      return permission.value
    },
    getAllMenuPath(): string[] {
      let p: string[] = []
      this.getAllMenu.forEach((v: StMenu) => {
        p = p.concat(memuPath(v))
      })
      if (
        import.meta.env.DEV
  || import.meta.env.VITE_APP_MOCK_IN_PRODUCTION === 'true' || import.meta.env.VITE_BUILD_DEMONSTRATE === 'true'
      ) {
        exampleMenu.forEach((v) => {
          p = p.concat(memuPath(v))
        })
      }
      return p
    },
    isLogged(): boolean {
      return logged.value
    },
  },
  actions: {
    validMenu(_path: string): boolean {
      return false
    },
    validPermission(p: string[]): boolean {
      return p.every(v => permission.value.includes(v))
    },
    setLogged() {
      logged.value = true
    },
    setToken(token: string) {
      if (!token) {
        this.setUset({})
        this.setMenus([])
        logged.value = false
      }

      if (this.keepLogin) {
        sessionToken.value = ''
        this.token = token
        return
      }
      sessionToken.value = token
      this.token = ''
    },
    setUset(u: { [key: string]: any }) {
      user.value = u
    },
    setMenus(m: any) {
      memu.value = m
    },
    appendMenus(m: StMenu[]) {
      this.aloneMenu = m
    },
    setPermission(p: string[]) {
      permission.value = p
    },
  },
  persist: {
    key: storageKey('user'),
  },
})

function memuPath(m: StMenu): string[] {
  let p: string[] = []
  if (m.children && m.children.length > 0) {
    m.children.forEach((item) => {
      p = p.concat(memuPath(item))
    })
  }

  else if (m.path) {
    p.push(m.path)
  }

  return p
}
