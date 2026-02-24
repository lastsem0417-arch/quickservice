import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BookingService } from '../../services/booking.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.html'
})
export class BookingListComponent {

  bookings$!: Observable<any[]>;

  constructor(private bookingService: BookingService) {
    this.bookings$ = this.bookingService.getBookings();
  }

  delete(id: string) {
    this.bookingService.deleteBooking(id).subscribe(() => {
      this.bookings$ = this.bookingService.getBookings(); // refresh
    });
  }
}