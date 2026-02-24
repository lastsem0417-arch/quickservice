import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {

  api = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  // USER – create booking
  book(data: any) {
    return this.http.post(this.api + '/add', data);
  }
  deleteBooking(id: string) {
  return this.http.delete(this.api + '/' + id);
}
getUserBookings(userId: string) {
  return this.http.get<any[]>(this.api + '/user/' + userId);
}
  // ADMIN – get all bookings ✅ (YE MISS THA)
getBookings() {
  return this.http.get<any[]>(this.api); // 🔥 TYPE FIX
}}
