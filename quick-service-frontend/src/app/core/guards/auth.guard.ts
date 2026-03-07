import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

/**
 * Route Guard to protect authenticated routes
 * Redirects to login if user is not authenticated
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isExpired = authService.isTokenExpired();

  if (token && !isExpired) {
    return true;
  }

  // Store intended destination
  sessionStorage.setItem('redirectUrl', state.url);

  // Redirect to login
  router.navigate(['/login']);
  return false;
};

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const isExpired = this.authService.isTokenExpired();

    if (token && !isExpired) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
