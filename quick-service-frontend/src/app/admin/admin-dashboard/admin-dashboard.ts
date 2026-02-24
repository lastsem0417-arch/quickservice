import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <h2>Admin Dashboard</h2>

    <ul>
      <li><a routerLink="/add-service">Add Service</a></li>
      <li><a routerLink="/admin-bookings">View Bookings</a></li>
    </ul>
  `
})
export class AdminDashboardComponent {}