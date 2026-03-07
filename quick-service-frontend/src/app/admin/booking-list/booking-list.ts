import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.css']
})
export class BookingListComponent implements OnInit {

  bookings:any[] = [];
  loading = false;

  selectedStatus = 'all';

  statuses = [
    'all',
    'pending',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled'
  ];

  constructor(
    private bookingService:BookingService,
    private notification:NotificationService,
    private auth:AuthService,
    private router:Router
  ){}

  ngOnInit(){

    const role = this.auth.getUserRole();

    if(role !== 'admin'){
      this.router.navigate(['/login']);
      return;
    }

    this.loadBookings();

  }

  loadBookings(){

    this.loading = true;

    const status =
    this.selectedStatus !== 'all'
    ? this.selectedStatus
    : undefined;

    this.bookingService
      .getAllBookings(1,20,status)
      .subscribe({

        next:(res:any)=>{

          console.log("BOOKINGS:",res);

          this.bookings = res?.data || [];

          this.loading = false;

        },

        error:(err)=>{

          console.error("BOOKING ERROR:",err);

          this.notification.showError("Failed to load bookings");

          this.loading = false;

        }

      });

  }

  onStatusChange(){

    this.loadBookings();

  }

  approveBooking(booking:any){

    this.bookingService
      .approveBooking(booking._id)
      .subscribe(()=>{

        this.notification.showSuccess("Booking approved");

        this.selectedStatus = "all";

        this.loadBookings();

      });

  }

  rejectBooking(booking:any){

    this.bookingService
      .cancelBooking(booking._id,"Rejected by admin")
      .subscribe(()=>{

        this.notification.showSuccess("Booking rejected");

        this.loadBookings();

      });

  }

  deleteBooking(booking:any){

    if(!confirm("Delete booking?")) return;

    this.bookingService
      .deleteBooking(booking._id)
      .subscribe(()=>{

        this.notification.showSuccess("Booking deleted");

        this.loadBookings();

      });

  }

}