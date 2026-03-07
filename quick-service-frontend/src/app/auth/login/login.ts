import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  login() {

    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res) => {

        this.loading = false;

        if (res && res.success && res.data) {

          const token = res.data.token;
          const user = res.data.user;

          console.log("LOGIN SUCCESS:", user);

          // Save token
          this.auth.saveToken(token);

          // Save role
          localStorage.setItem('userRole', user.role);

          // Save current user
          this.auth.setCurrentUser(user);

          this.notification.showSuccess(`Welcome ${user.name}!`);

          // Redirect
          if (user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }

        } else {
          this.errorMsg = 'Login failed';
          this.notification.showError(this.errorMsg);
        }

      },

      error: (err) => {

        this.loading = false;

        console.error('Login error:', err);

        this.errorMsg = err?.error?.message || 'Invalid email or password';

        this.notification.showError(this.errorMsg);

      }

    });

  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}