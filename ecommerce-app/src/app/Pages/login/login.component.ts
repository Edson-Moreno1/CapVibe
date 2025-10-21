import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder, FormGroup, Validators
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup; // Propiedad para el formulario

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

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulario válido:', this.loginForm.value);
      // TODO: Llamar al método login del AuthService con los datos
      
      // Simulación temporal de login exitoso:
      this.authService.login(); // Llama al método simulado del servicio
      this.router.navigate(['/']); // Redirige al Home después del login
      
    } else {
      console.log('Formulario inválido');
      // Marcar campos como 'touched' para mostrar errores si es necesario
      this.loginForm.markAllAsTouched(); 
    }
  }
}