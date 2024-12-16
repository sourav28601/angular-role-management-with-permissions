import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { NavigationService } from '../../services/navigation/navigation.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const navigationService = inject(NavigationService);

  return next(req).pipe(
    catchError((error) => {
      // Check if it's an HttpErrorResponse
      if (error.status === 400) {
        // Custom handling for 400 Bad Request
        navigationService.showErrorAndRedirect({
          title: 'Access Denied',
          text: error.error?.error || 'You do not have sufficient permissions to access this resource.'
        });
      } else if (error.status === 401) {
        // Handling for Unauthorized errors
        navigationService.showErrorAndRedirect({
          title: 'Unauthorized',
          text: 'Please log in to access this resource.',
          redirectRoute: '/login'
        });
      } else if (error.status === 403) {
        // Handling for Forbidden errors
        navigationService.showErrorAndRedirect({
          title: 'Forbidden',
          text: 'You do not have permission to access this resource.'
        });
      } else {
        // Generic error handling
        navigationService.showErrorAndRedirect({
          text: error.message || 'An unexpected error occurred.'
        });
      }

      // Re-throw the error to allow other error handlers to process it
      return throwError(() => error);
    })
  );
};