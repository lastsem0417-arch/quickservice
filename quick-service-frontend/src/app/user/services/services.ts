import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServiceService } from '../../services/service.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements OnInit {

  services: any[] = [];
  loading = true;

  searchQuery = '';
  selectedCategory = 'all';
  minPrice = '';
  maxPrice = '';

  currentPage = 1;
  pageSize = 12;
  totalServices = 0;
  totalPages = 1;

  selectedService:any = null;
  date = '';
  today = new Date().toISOString().split('T')[0];

  categories = [
    'all','Cleaning','Plumbing','Electrical','Carpentry',
    'Painting','Gardening','AC Repair','Appliance Repair',
    'Beauty','Tutoring'
  ];

  constructor(
    private serviceService: ServiceService,
    private bookingService: BookingService,
    private auth: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(){
    this.loadServices();
  }

  loadServices(){

    this.loading = true;

    const filters:any = {};

    if(this.selectedCategory !== 'all'){
      filters.category = this.selectedCategory;
    }

    if(this.minPrice){
      filters.minPrice = this.minPrice;
    }

    if(this.maxPrice){
      filters.maxPrice = this.maxPrice;
    }

    if(this.searchQuery){
      filters.search = this.searchQuery;
    }

    this.serviceService
    .getServices(this.currentPage,this.pageSize,filters)
    .subscribe({

      next:(res:any)=>{

        if(res.success){

          this.services = res.data || [];

          this.totalServices = res.pagination?.total || 0;
          this.totalPages = res.pagination?.pages || 1;

        }

        this.loading = false;

      },

      error:(err)=>{

        console.error(err);

        this.notification.showError("Failed to load services");

        this.loading = false;

      }

    });

  }

  searchServices(){
    this.currentPage = 1;
    this.loadServices();
  }

  onCategoryChange(){
    this.currentPage = 1;
    this.loadServices();
  }

  onPriceChange(){
    this.currentPage = 1;
    this.loadServices();
  }

  nextPage(){
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.loadServices();
    }
  }

  prevPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.loadServices();
    }
  }

  viewServiceDetails(service:any){
    this.selectedService = service;
  }

  closeServiceDetails(){
    this.selectedService = null;
  }

  book(service:any){

    const userId = this.auth.getUserId();

    if(!userId){

      this.notification.showError("Please login first");
      return;

    }

    if(!this.date){

      this.notification.showError("Select booking date");
      return;

    }

    this.bookingService
    .createBooking({

      serviceId: service._id,
      bookingDate: this.date,
      startTime:"09:00",

      address:{
        city:"Ahmedabad",
        zipCode:"380001"
      }

    })
    .subscribe({

      next:(res:any)=>{

        if(res.success){

          this.notification.showSuccess("Booking successful ✅");

          this.date = '';
          this.selectedService = null;

        }

      },

      error:()=>{

        this.notification.showError("Booking failed");

      }

    });

  }

}