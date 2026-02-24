import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html'
})
export class MyBookingsComponent {

  bookings$!: Observable<any[]>;

  constructor(
    private bookingService: BookingService,
    private auth: AuthService
  ) {
    const userId = this.auth.getUserId(); // 🔥 real logged-in user id

    if (userId) {
      this.bookings$ = this.bookingService.getUserBookings(userId);
    }
  }
}