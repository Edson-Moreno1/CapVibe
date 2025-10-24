import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Importa tu AuthService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {} // Inyecta AuthService

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtiene el token actual del AuthService
    const authToken = this.authService.getToken();


    if (authToken && request.url.startsWith('/api')) { 
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}` 
        }
      });
    }

    
    return next.handle(request);
  }
}