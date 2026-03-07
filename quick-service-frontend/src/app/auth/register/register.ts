import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  isAdmin = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    console.log('Registering with:', {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.isAdmin ? 'admin' : 'user'
    });

    this.auth.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.isAdmin ? 'admin' : 'user'
    }).subscribe({
      next: () => {
        alert('Registration successful ✅');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration failed ❌');
      }
    });
  }
}