import { defineStore } from 'pinia'

type User = {
  id: number
  username: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false as boolean,
    currentUser: null as User | null,
    token: null as string | null,
    csrf: null as string | null,
  }),

  getters: {
    isLoggedIn(state): boolean {
      return state.isAuthenticated || !!(localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('token'))
    },
  },

  actions: {
    initializeFromStorage(): void {
      const stored = localStorage.getItem('isAuthenticated')
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('currentUser')
      const csrf = localStorage.getItem('csrf')
      if (stored === 'true' && token && userStr) {
        this.isAuthenticated = true
        this.currentUser = JSON.parse(userStr)
        this.token = token
        this.csrf = csrf
      }
    },

    async login(username: string, password: string): Promise<boolean> {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data?.success && data?.data?.token) {
        this.isAuthenticated = true
        this.currentUser = data.data.user
        this.token = data.data.token
        this.csrf = data.data.csrf || null
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        localStorage.setItem('token', this.token)
        if (this.csrf) localStorage.setItem('csrf', this.csrf)
        return true
      }
      return false
    },

    async logout(): Promise<void> {
      try { await fetch('/api/users/logout', { method: 'POST', credentials: 'include' }) } catch {}
      this.isAuthenticated = false
      this.currentUser = null
      this.token = null
      this.csrf = null
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
      localStorage.removeItem('csrf')
    }
  }
})


