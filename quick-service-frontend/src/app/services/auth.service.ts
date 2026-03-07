import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  profilePicture?: string;
  address?: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  // ===== AUTHENTICATION METHODS =====

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, data);
  }

  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, data);
  }

  // ===== TOKEN MANAGEMENT =====

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  // ===== USER INFORMATION =====

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  getUserRole(): 'user' | 'admin' | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      return Date.now() >= expiresAt;
    } catch {
      return true;
    }
  }

  // ===== USER STATE =====

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.api}/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/profile`, data);
  }

  setCurrentUser(user: User): void {
    this.currentUser$.next(user);
    this.isLoggedIn$.next(true);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  logout(): void {
    this.removeToken();
    this.currentUser$.next(null);
    this.isLoggedIn$.next(false);
  }

  // ===== PRIVATE HELPERS =====

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      this.isLoggedIn$.next(true);
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }
}