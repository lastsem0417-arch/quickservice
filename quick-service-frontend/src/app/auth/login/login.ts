import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule], // ✅ ADD THIS
  templateUrl: './login.html'
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}
login() {
  this.loading = true;
  this.errorMsg = '';

  this.auth.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res: any) => {
      this.auth.saveToken(res.token);

      // 🔥 ROLE BASED REDIRECT
      if (res.user.role === 'admin') {
  this.router.navigate(['/admin-dashboard']);
} else {
  this.router.navigate(['/dashboard']);
}
    },
    error: () => {
      this.errorMsg = 'Invalid email or password';
      this.loading = false;
    }
  });
}}
