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
      const response = await fetch('/api/users/login', {
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
        
        // Store in localStorage for persistence
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('token', this.token);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.token = null;
    
    // Clear from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
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
}

export const authService = new AuthService();
