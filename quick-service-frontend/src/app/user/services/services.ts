import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ServiceService } from '../../services/service.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html'
})
export class ServicesComponent {

  services$!: Observable<any[]>;
  date = '';

  constructor(
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private auth: AuthService
  ) {
    // load services
    this.services$ = this.serviceService.getServices();
  }

  book(service: any) {
    const userId = this.auth.getUserId(); // 🔥 REAL LOGGED-IN USER ID

    if (!userId) {
      alert('User not logged in');
      return;
    }

    if (!this.date) {
      alert('Please select date');
      return;
    }

    this.bookingService.book({
      serviceName: service.name,
      date: this.date,
      userId: userId
    }).subscribe(() => {
      alert('Booking Successful ✅');
      this.date = '';
    });
  }
}