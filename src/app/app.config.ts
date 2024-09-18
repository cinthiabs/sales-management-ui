import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { headersInterceptor } from './services/interceptor/headers/headers.interceptor';
import { authInterceptor } from './services/interceptor/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), 
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([headersInterceptor, authInterceptor])
    )
  ]
};
