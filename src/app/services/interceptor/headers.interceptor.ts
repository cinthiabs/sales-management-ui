import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  
  const request = req.clone({
    url: `${environment.api}${req.url}`
  });
  
  return next(request);
};
