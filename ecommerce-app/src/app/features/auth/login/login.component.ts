import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import{
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router,RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router);

  errorMessage: string ='';
  isLoading: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void{
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next:(user) => {
        console.log('Login exitoso:', user);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error:(err)=>{
        console.error('Error en el login:', err);

        if(err.status === 401 || err.status === 400){
          this.errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else {
          this.errorMessage = 'Ocurrió un error en el servidor. Intenta más tarde.';
        }
      }
    });
  }
}