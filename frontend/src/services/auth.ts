// Authentication service using real API
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

class AuthService {
  private isAuthenticated = false;
  private currentUser: User | null = null;
  private token: string | null = null;

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.data.token) {
        this.isAuthenticated = true;
        this.currentUser = data.data.user;
        this.token = data.data.token;
        const csrf = (data as any).data?.csrf || ''
        
        // Store in localStorage for persistence
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('token', this.token);
        if (csrf) localStorage.setItem('csrf', csrf);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {}
    this.isAuthenticated = false;
    this.currentUser = null;
    this.token = null;
    
    // Clear from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('csrf');

    try {
      // Sync Pinia store if present and redirect
      const { useAuthStore } = await import('../stores/auth')
      const store = useAuthStore()
      store.isAuthenticated = false
      store.currentUser = null
      store.token = null
      store.csrf = null
      const router = (await import('../router')).default
      router.push('/login')
    } catch {}
  }

  getAuthStatus(): boolean {
    // Check localStorage first
    const stored = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('currentUser');
    
    if (stored === 'true' && token && userStr) {
      this.isAuthenticated = true;
      this.currentUser = JSON.parse(userStr);
      this.token = token;
    }
    return this.isAuthenticated;
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getAuthStatus();
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const resp = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })
      const data = await resp.json()
      return !!data?.success
    } catch (e) {
      return false
    }
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    try {
      const resp = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      })
      const data = await resp.json()
      return !!data?.success
    } catch (e) {
      return false
    }
  }
}

export const authService = new AuthService();
