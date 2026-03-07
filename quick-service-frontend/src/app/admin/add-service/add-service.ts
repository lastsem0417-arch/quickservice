import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ServiceService } from '../../services/service.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-service.html',
  styleUrls: ['./add-service.css']
})
export class AddServiceComponent implements OnInit {

  name = '';
  description = '';
  category = 'Cleaning';
  price = '';
  estimatedDuration = '60';

  loading = false;
  error = '';

  categories = [
    'Cleaning',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Gardening',
    'AC Repair',
    'Appliance Repair',
    'Beauty',
    'Tutoring'
  ];

  constructor(
    private serviceService: ServiceService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {

    const role = localStorage.getItem('userRole');

    if (role !== 'admin') {

      this.notification.showError('Admin access required');

      this.router.navigate(['/dashboard']);

      return;

    }

  }

  add() {

    this.error = '';

    // validation
    if (
      !this.name.trim() ||
      !this.description.trim() ||
      !this.price
    ) {

      this.error = "Please fill all required fields";
      return;

    }

    const priceValue = Number(this.price);

    if (isNaN(priceValue) || priceValue <= 0) {

      this.error = "Enter valid price";
      return;

    }

    const serviceData = {

      name: this.name.trim(),

      description: this.description.trim(),

      category: this.category,

      price: priceValue,

      estimatedDuration: Number(this.estimatedDuration)

    };

    this.loading = true;

    this.serviceService
      .addService(serviceData)
      .subscribe({

        next: (res:any) => {

          if (res.success) {

            this.notification.showSuccess(
              "Service Added Successfully"
            );

            this.resetForm();

            this.loading = false;

            // reload dashboard
            setTimeout(()=>{

              this.router.navigateByUrl(
                '/',
                { skipLocationChange: true }
              ).then(()=>{

                this.router.navigate(['/admin-dashboard']);

              });

            },800);

          }

        },

        error: (err) => {

          console.error("ADD SERVICE ERROR:",err);

          this.notification.showError(
            "Failed to add service"
          );

          this.loading = false;

        }

      });

  }

  resetForm(){

    this.name = '';

    this.description = '';

    this.category = 'Cleaning';

    this.price = '';

    this.estimatedDuration = '60';

    this.error = '';

  }

}