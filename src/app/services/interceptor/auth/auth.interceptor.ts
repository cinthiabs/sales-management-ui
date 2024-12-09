import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = localStorage.getItem('token');
  const router = inject(Router); 

  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};
