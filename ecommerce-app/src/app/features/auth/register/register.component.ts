import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Aunque aún no lo usemos para el registro real
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup; // Propiedad para el formulario
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Lo inyectamos para futura implementación
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required], // Campo nombre: obligatorio
      email: ['', [Validators.required, Validators.email]], // Campo email: obligatorio y formato email
      password: ['', [Validators.required, Validators.minLength(6)]] // Campo password: obligatorio y mínimo 6 caracteres
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.valid) {
      const userData = this.registerForm.value; // Obtiene name, email, password
      
      // Llama al método register del servicio
      this.authService.register(userData).subscribe({
        next: (response) => {
          // Si el registro es exitoso
          console.log('Registro exitoso:', response);
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']); // Redirige al Login
        },
       error: (err: HttpErrorResponse) => { // <-- 2. Captura el error HTTP
          console.error('Error en el login:', err);
          // Guarda el mensaje de error de la API o uno genérico
          this.errorMessage = err.error?.message || 'Credenciales incorrectas o error del servidor.';
        }
      });
      
    } else {
      console.log('Formulario de registro inválido');
      this.registerForm.markAllAsTouched(); 
    }
  }
}