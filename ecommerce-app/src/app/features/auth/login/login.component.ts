import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Imports de Core
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css' // Asegúrate de que este archivo exista (aunque esté vacío)
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        // Redirigir al home o dashboard
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error login:', err);
        this.isLoading = false;
        
        // Manejo de errores amigable
        if (err.status === 401 || err.status === 400) {
          this.errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else {
          this.errorMessage = 'Ocurrió un error de conexión. Intenta más tarde.';
        }
      }
    });
  }
}