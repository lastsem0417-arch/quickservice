import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-booking.css'
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  selectedStatus = 'all';
  statuses = ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

  constructor(
    private bookingService: BookingService,
    private auth: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    const userId = this.auth.getUserId();

    if (userId) {
      this.bookingService.getUserBookings(userId).subscribe({
        next: (response: any) => {
          if (response.success) {
            const data = response.data;
            // Handle both array and single object response
            this.bookings = Array.isArray(data) ? data : (data ? [data] : []);
            this.loading = false;
          }
        },
        error: (err: any) => {
          console.error('Failed to load bookings:', err);
          this.notification.showError('Failed to load bookings');
          this.loading = false;
        }
      });
    }
  }

  onStatusChange() {
    // Filter logic handled in template with ngIf
  }

  cancelBooking(booking: any) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(booking._id, 'Cancelled by user').subscribe({
        next: (response) => {
          if (response.success) {
            this.notification.showSuccess('Booking cancelled successfully');
            this.loadBookings();
          }
        },
        error: (err) => {
          this.notification.showError('Failed to cancel booking');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      'in-progress': 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }
}