export default defineStore('user', {
  state() {
    return {
      token: '',
      user: {} as { [key: string]: any },
    }
  },
  getters: {
    getToken(): string {
      return this.token
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
      this.token = token
    },
    setUset(user: { [key: string]: any }) {
      this.user = user
    },
  },
  persist: {
    key: storageKey('user'),
  },
})
