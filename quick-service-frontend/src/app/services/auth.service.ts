import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: any) {
    return this.http.post(this.api + '/login', data);
  }

  // REGISTER
  register(data: any) {
    return this.http.post(this.api + '/register', data);
  }

  // SAVE TOKEN
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // GET TOKEN
  getToken() {
    return localStorage.getItem('token');
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('token');
  }

  // 🔥 GET LOGGED-IN USER ID FROM TOKEN
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  }

  // (OPTIONAL) GET ROLE FROM TOKEN
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  }
}