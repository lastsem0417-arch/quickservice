import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Booking {
  _id: string;
  serviceId: string;
  userId: any;
  serviceName: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  bookingDate: string;
  startTime: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data: Booking | Booking[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private api = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  // CREATE BOOKING
  createBooking(data: any): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.api, data);
  }

  // ADMIN - GET ALL BOOKINGS
  getAllBookings(page = 1, limit = 20, status?: string): Observable<BookingResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<BookingResponse>(this.api, { params });
  }

  // USER BOOKINGS
  getUserBookings(userId: string, page = 1, limit = 10): Observable<BookingResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<BookingResponse>(`${this.api}/user/${userId}`, { params });
  }

  // APPROVE BOOKING
  approveBooking(id: string): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.api}/${id}/approve`,
      {}
    );

  }

  // UPDATE STATUS
  updateBookingStatus(id: string, status: string): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.api}/${id}/status`,
      { status }
    );

  }

  // CANCEL BOOKING
  cancelBooking(id: string, reason?: string): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.api}/${id}/cancel`,
      { reason }
    );

  }

  // DELETE BOOKING
  deleteBooking(id: string): Observable<BookingResponse> {

    return this.http.delete<BookingResponse>(
      `${this.api}/${id}`
    );

  }

}