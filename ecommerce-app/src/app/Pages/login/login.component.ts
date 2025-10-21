import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder, FormGroup, Validators
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Propiedad para el formulario

  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder
    private authService: AuthService,
    private router: Router
  ) {
    // Define la estructura y validaciones del formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo email: obligatorio y formato email
      password: ['', Validators.required] // Campo password: obligatorio
    });
  }

  // login.component.ts
  // ... (imports y constructor) ...

  onSubmit(): void {
    this.errorMessage = null; // Limpia errores anteriores al enviar
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => { // <-- 2. Captura el error HTTP
          console.error('Error en el login:', err);
          // Guarda el mensaje de error de la API o uno genérico
          this.errorMessage = err.error?.message || 'Credenciales incorrectas o error del servidor.';
          // No limpiamos el formulario en caso de error para que el usuario pueda corregir
        }
      });
    } else {
      console.log('Formulario inválido');
      this.loginForm.markAllAsTouched();
    }
  }
}