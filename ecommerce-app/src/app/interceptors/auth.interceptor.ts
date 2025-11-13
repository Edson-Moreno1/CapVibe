import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Importa tu AuthServic
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router
  ) {} // Inyecta AuthService

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

    
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        if(error.status===401){
          console.error('Interceptor: Error 401. Token expirado o invalido. Deslogueando...');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(()=>error);
      })
    );
    
  }
}