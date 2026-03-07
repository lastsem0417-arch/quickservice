import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

/**
 * Route Guard to protect role-based routes
 * Checks if user has the required role
 */
@Injectable({ providedIn: 'root' })
export class RoleGuardService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && requiredRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have required role
    this.router.navigate(['/']);
    return false;
  }
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && requiredRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
