import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalServices: number;
    totalBookings: number;
    totalReviews: number;
    totalRevenue: number;
    averageRating: number;
  };
  bookingBreakdown: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  topServices: any[];
  recentBookings: any[];
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // GET DASHBOARD STATS
  getDashboardStats(){
  return this.http.get<any>(`${this.api}/dashboard`);
}

  // GET ANALYTICS
  getAnalytics(period = 'month'): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${this.api}/analytics`, {
      params: new HttpParams().set('period', period)
    });
  }

  // GET ALL USERS
  getAllUsers(page = 1, limit = 20, search?: string): Observable<AdminResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<AdminResponse>(`${this.api}/users`, { params });
  }

  // DEACTIVATE USER
  deactivateUser(userId: string): Observable<AdminResponse> {
    return this.http.put<AdminResponse>(`${this.api}/users/${userId}/deactivate`, {});
  }

  // ACTIVATE USER
  activateUser(userId: string): Observable<AdminResponse> {
    return this.http.put<AdminResponse>(`${this.api}/users/${userId}/activate`, {});
  }
}
