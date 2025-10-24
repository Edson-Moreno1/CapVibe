import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
// 1. Importa provideHttpClient y withInterceptors
import {withInterceptorsFromDi,HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // <-- 2. Importa tu Interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 3. Reemplaza importProvidersFrom(HttpClientModule) por esto:
    provideHttpClient(
      withInterceptorsFromDi()), // <-- Registra el interceptor aquí
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};