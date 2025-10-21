import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Importa tu AuthService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {} // Inyecta AuthService

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtiene el token actual del AuthService
    const authToken = this.authService.getToken();

    // Si existe un token y la petición va a nuestra API (puedes ajustar la condición si es necesario)
    if (authToken && request.url.startsWith('/api')) { // Asume que usas proxy o ajusta la URL base
      // Clona la petición original y añade la cabecera 'Authorization'
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}` // Formato estándar Bearer token
        }
      });
    }

    // Pasa la petición (modificada o no) al siguiente manejador
    return next.handle(request);
  }
}