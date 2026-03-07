import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { ServicesComponent } from './user/services/services';
import { AddServiceComponent } from './admin/add-service/add-service';
import { BookingListComponent } from './admin/booking-list/booking-list';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard';
import { MyBookingsComponent } from './user/my-bookings/my-bookings';
import { AuthGuardService } from './core/guards/auth.guard';
import { RoleGuardService } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // User routes (require authentication)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'services',
    component: ServicesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'my-bookings',
    component: MyBookingsComponent,
    canActivate: [AuthGuardService]
  },

  // Admin routes (require authentication + admin role)
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'add-service',
    component: AddServiceComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin-bookings',
    component: BookingListComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ['admin'] }
  },

  // Wildcard route
  { path: '**', redirectTo: 'login' }
];
