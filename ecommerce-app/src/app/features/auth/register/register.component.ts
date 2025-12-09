import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Imports de Core
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: () => {
        // Éxito: Redirigir al Login para que inicie sesión
        alert('Cuenta creada con éxito. Por favor inicia sesión.');
        this.router.navigate(['/login']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error registro:', err);
        this.isLoading = false;
        
        // Mensaje de error del backend (ej. "El correo ya existe")
        this.errorMessage = err.error?.message || 'No se pudo crear la cuenta.';
      }
    });
  }
}