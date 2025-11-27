import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- 1. Importa HttpClient
import { Router } from '@angular/router'; // <-- 2. Importa Router
import { BehaviorSubject, Observable, tap } from 'rxjs'; // <-- 3. Importa tap
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de tu API (ajusta si es necesario, usa environment si prefieres)
  private baseUrl = `${environment.BACK_URL}/auth`;
  private apiUrl = '/api/auth'; // Usando el proxy o tu URL completa
  
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken()); // <-- 6. Comprueba token al inicio
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private http: HttpClient, // <-- Inyecta HttpClient
    private router: Router   // <-- Inyecta Router
  ) {}

  // 5a. Método para Registro (llama a POST /api/auth/register)
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // 5b. Método para Login (llama a POST /api/auth/login)
  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si el login es exitoso (hay token)
        if (response.token) {
          localStorage.setItem('authToken', response.token); // Guarda el token
          this.loggedIn.next(true); // Actualiza el estado a logueado
        }
      })
    );
  }

  // 5c. Método para Logout
  logout(): void {
    localStorage.removeItem('authToken'); // Elimina el token
    this.loggedIn.next(false); // Actualiza el estado a no logueado
    this.router.navigate(['/login']); // Redirige al login
  }

  // Método privado para comprobar si existe un token en localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Opcional: Método para obtener el token si lo necesitas en otras partes
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}