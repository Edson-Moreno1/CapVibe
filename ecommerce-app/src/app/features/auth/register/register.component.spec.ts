import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('2. Debe inicializar el formulario con campos vacíos', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('3. El formulario debe ser inválido cuando está vacío', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('4. El campo password debe requerir mínimo 6 caracteres', () => {
    const passwordControl = component.registerForm.get('password');
    
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
    
    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('5. El formulario debe ser válido con datos correctos', () => {
    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@mail.com',
      password: '123456'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('6. Debe llamar a authService.register cuando el formulario es válido', () => {
    authServiceSpy.register.and.returnValue(of({ message: 'Usuario creado' }));

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@mail.com',
      password: '123456'
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@mail.com',
      password: '123456'
    });
  });

  it('7. Debe mostrar successMessage y redirigir después de registro exitoso', fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of({ message: 'Usuario creado' }));

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@mail.com',
      password: '123456'
    });

    component.onSubmit();

    expect(component.successMessage).toBe('¡Cuenta creada exitosamente! Redirigiendo...');
    expect(component.loading).toBeFalse();

    tick(2000);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('8. Debe mostrar errorMessage cuando el registro falla', () => {
    const errorResponse = { error: { message: 'Email ya existe' } };
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@mail.com',
      password: '123456'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Email ya existe');
    expect(component.loading).toBeFalse();
  });

  it('9. No debe llamar al servicio si el formulario es inválido', () => {
    component.registerForm.setValue({
      name: '',
      email: 'invalid',
      password: '123'
    });

    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });
});
