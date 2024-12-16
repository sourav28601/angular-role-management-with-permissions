// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the authentication token from your service or storage
  const data = JSON.parse(localStorage.getItem('user_data') || '{}');
  let authToken = data.data?.token;
  
  console.log("interceptor token",authToken)
  
  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: authToken ? `Bearer ${authToken}` : ''
    }
  });

  // Pass the cloned request instead of the original request
  return next(authReq);
};