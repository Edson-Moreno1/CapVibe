import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('2. Debe inicializar el formulario con campos vacíos', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('3. El formulario debe ser inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('4. El campo email debe requerir un formato válido', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalido');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valido@test.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('5. El formulario debe ser válido con datos correctos', () => {
    component.loginForm.setValue({
      email: 'test@mail.com',
      password: '123456'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('6. Debe llamar a authService.login cuando el formulario es válido', () => {
    authServiceSpy.login.and.returnValue(of({ 
      _id: '123', 
      name: 'Test', 
      email: 'test@mail.com', 
      token: 'fake-token',
      role: 'cliente'
    }));

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: '123456'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@mail.com',
      password: '123456'
    });
  });

  it('7. Debe redirigir a /products después de login exitoso', () => {
    authServiceSpy.login.and.returnValue(of({ 
      _id: '123', 
      name: 'Test', 
      email: 'test@mail.com', 
      token: 'fake-token',
      role: 'cliente'
    }));

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: '123456'
    });

    component.onSubmit();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/products');
    expect(component.loading).toBeFalse();
  });

  it('8. Debe mostrar errorMessage cuando el login falla', () => {
    const errorResponse = { error: { message: 'Credenciales inválidas' } };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: 'wrong'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(component.loading).toBeFalse();
  });

  it('9. No debe llamar al servicio si el formulario es inválido', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
