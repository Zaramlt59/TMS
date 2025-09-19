import { defineStore } from 'pinia'
import { ROLES, type UserRole } from '../constants/roles'

type User = {
  id: number
  username: string
  email: string
  phone?: string
  role: UserRole
  is_active: boolean
  school_id?: string
  district?: string
  rd_block?: string
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
    
    // Role-based getters
    isSuperAdmin(state): boolean {
      return state.currentUser?.role === ROLES.SUPER_ADMIN
    },
    
    isAdmin(state): boolean {
      return state.currentUser?.role === ROLES.ADMIN || state.currentUser?.role === ROLES.SUPER_ADMIN
    },
    
    isDEO(state): boolean {
      return state.currentUser?.role === ROLES.DEO
    },
    
    isSDEO(state): boolean {
      return state.currentUser?.role === ROLES.SDEO
    },
    
    isHOI(state): boolean {
      return state.currentUser?.role === ROLES.HOI
    },
    
    isTeacher(state): boolean {
      return state.currentUser?.role === ROLES.TEACHER
    },
    
    userRole(state): UserRole | null {
      return state.currentUser?.role || null
    }
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

    setUser(user: User): void {
      this.currentUser = user
      localStorage.setItem('currentUser', JSON.stringify(user))
    },

    setAuthenticated(authenticated: boolean): void {
      this.isAuthenticated = authenticated
      localStorage.setItem('isAuthenticated', authenticated.toString())
    },

    setToken(token: string): void {
      this.token = token
      localStorage.setItem('token', token)
    },

    async logout(): Promise<void> {
      try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }) } catch {}
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


