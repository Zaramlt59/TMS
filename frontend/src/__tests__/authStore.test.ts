import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes from storage', () => {
    // localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('token', 't')
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'u', email: 'e', role: 'admin', is_active: true, created_at: '' }))
    const store = useAuthStore()
    store.initializeFromStorage()
    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBe('t')
  })
})


