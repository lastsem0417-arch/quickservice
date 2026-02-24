import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Registration successful ✅');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Registration failed ❌');
      }
    });
  }
}