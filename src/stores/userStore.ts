const sessionToken = usePrefixStorage('token', '', sessionStorage)
export default defineStore('user', {
  state() {
    return {
      keepLogin: true,
      token: '',
      user: {} as { [key: string]: any },
    }
  },
  getters: {
    getToken(): string {
      return this.keepLogin ? this.token : sessionToken.value
    },
    getNickName(): string {
      return this.user?.nickname || this.user?.username || ''
    },
    getAvatar(): string {
      return this.user?.avatar
    },
  },
  actions: {
    setToken(token: string) {
      if (this.keepLogin) {
        sessionToken.value = ''
        this.token = token
        return
      }
      sessionToken.value = token
      this.token = ''
    },
    setUset(user: { [key: string]: any }) {
      this.user = user
    },
  },
  persist: {
    key: storageKey('user'),
  },
})
