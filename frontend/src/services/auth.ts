// Simple authentication service
interface User {
  username: string;
  role: string;
}

class AuthService {
  private isAuthenticated = false;
  private currentUser: User | null = null;

  login(username: string, password: string): boolean {
    // Simple hardcoded authentication
    if (username === 'Admin' && password === 'password') {
      this.isAuthenticated = true;
      this.currentUser = { username: 'Admin', role: 'admin' };
      
      // Store in localStorage for persistence
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    
    // Clear from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }

  getAuthStatus(): boolean {
    // Check localStorage first
    const stored = localStorage.getItem('isAuthenticated');
    if (stored === 'true') {
      this.isAuthenticated = true;
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getAuthStatus();
  }
}

export const authService = new AuthService();
