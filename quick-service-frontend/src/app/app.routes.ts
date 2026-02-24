import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { ServicesComponent } from './user/services/services';
import { AddServiceComponent } from './admin/add-service/add-service'; // ✅ IMPORTANT
import { BookingListComponent } from './admin/booking-list/booking-list';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard';
import { MyBookingsComponent } from './user/my-bookings/my-bookings';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'add-service', component: AddServiceComponent },// ✅
  { path: 'admin-bookings', component: BookingListComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'my-bookings', component: MyBookingsComponent }


];