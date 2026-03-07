import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  totalServices = 0;
  totalBookings = 0;
  pendingBookings = 0;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {

    if (this.authService.getUserRole() !== 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadDashboard();

  }

  loadDashboard(){

    this.adminService.getDashboardStats().subscribe((res:any)=>{

      console.log("DASHBOARD RESPONSE:", res);

      this.totalServices = res.data.stats.totalServices;
      this.totalBookings = res.data.stats.totalBookings;
      this.pendingBookings = res.data.bookingBreakdown.pending;

      // FORCE UI UPDATE
      this.cd.detectChanges();

    });

  }

  logout(){

    localStorage.clear();
    this.router.navigate(['/login']);

  }

}