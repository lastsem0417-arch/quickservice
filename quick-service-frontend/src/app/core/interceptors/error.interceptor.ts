import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Error Handling Interceptor
 * Catches HTTP errors and handles them globally
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);

      // Handle 401 - Unauthorized
      if (error.status === 401) {
        notificationService.showError('Session expired. Please login again.');
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      // Handle 403 - Forbidden
      if (error.status === 403) {
        notificationService.showError('You do not have permission to access this resource.');
      }

      // Handle 404 - Not Found
      if (error.status === 404) {
        notificationService.showError('Resource not found.');
      }

      // Handle 500 - Server Error
      if (error.status === 500) {
        notificationService.showError('Server error. Please try again later.');
      }

      // Handle validation errors (400)
      if (error.status === 400) {
        const errorMsg = error.error?.message || 'Invalid request';
        notificationService.showError(errorMsg);
      }

      // Handle network errors
      if (error.status === 0) {
        notificationService.showError('Network error. Please check your connection.');
      }

      return throwError(() => new Error(error.error?.message || 'An error occurred'));
    })
  );
};
