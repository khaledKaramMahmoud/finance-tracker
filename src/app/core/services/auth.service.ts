import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  private isAuthenticatedSignal = signal<boolean>(this.hasValidToken());

  // Public computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(private router: Router) {
    // Effect to sync authentication state
    effect(() => {
      const user = this.currentUser();
      console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
    });
  }

  /**
   * Mock login - simulates API call
   */
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (credentials.email && credentials.password) {
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            token: this.generateMockToken()
          };

          const response: AuthResponse = {
            user: mockUser,
            token: mockUser.token!
          };

          this.setSession(response);
          resolve(response);
        } else {
          reject({ error: 'Invalid credentials' });
        }
      }, 500);
    });
  }

  /**
   * Mock register - simulates API call
   */
  register(request: RegisterRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (request.email && request.password && request.name) {
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: request.email,
            name: request.name,
            token: this.generateMockToken()
          };

          const response: AuthResponse = {
            user: mockUser,
            token: mockUser.token!
          };

          this.setSession(response);
          resolve(response);
        } else {
          reject({ error: 'Invalid registration data' });
        }
      }, 500);
    });
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set session data
   */
  private setSession(authResponse: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, authResponse.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
    }
    this.currentUserSignal.set(authResponse.user);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Get user from storage
   */
  private getUserFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if valid token exists
   */
  private hasValidToken(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Generate mock JWT token
   */
  private generateMockToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: '1234567890', 
      name: 'User', 
      iat: Date.now() 
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }
}

