import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Review {
  _id: string;
  serviceId: string;
  bookingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review | Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  // CREATE REVIEW
  createReview(data: any): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.api, data);
  }

  // GET SERVICE REVIEWS
  getServiceReviews(serviceId: string, page = 1, limit = 10): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.api}/service/${serviceId}`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
    });
  }

  // UPDATE REVIEW
  updateReview(id: string, data: any): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.api}/${id}`, data);
  }

  // DELETE REVIEW
  deleteReview(id: string): Observable<ReviewResponse> {
    return this.http.delete<ReviewResponse>(`${this.api}/${id}`);
  }
}
