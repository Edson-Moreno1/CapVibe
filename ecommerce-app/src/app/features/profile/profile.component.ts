// src/app/features/profile/profile.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/models/user.interface';
import { OrderData } from '../../core/models/order.interface';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);

  currentUser: User | null = null;
  orders: OrderData[] = [];
  isLoading = true;
  errorMessage = '';

  // edición
  editMode = false;
  saving = false;
  profileForm!: FormGroup;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.initForm(user);
      }
    });

    this.loadOrders();
  }

  initForm(user: User): void {
    this.profileForm = this.fb.group({
      name: [user.name || '', [Validators.required, Validators.minLength(3)]],
      email: [user.email || '', [Validators.required, Validators.email]]
      // aquí podrías agregar más campos si tu modelo los expone
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (response: any) => {
        this.orders =
          response.orders ||
          response.data ||
          (Array.isArray(response) ? response : []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando órdenes:', err);
        if (err.status !== 404) {
          this.errorMessage = 'No se pudo cargar el historial de compras.';
        }
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    if (!this.currentUser) return;
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.initForm(this.currentUser);
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.currentUser) {
      this.initForm(this.currentUser);
    }
  }

  saveProfile(): void {
    if (!this.profileForm || this.profileForm.invalid || !this.currentUser) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const { name, email } = this.profileForm.value;

    // Aquí deberías llamar a tu servicio de usuarios:
    // this.userService.updateUser(this.currentUser._id, { name, email }).subscribe(...)
    // Como no lo has mostrado, de momento simulamos el guardado:

    setTimeout(() => {
      // Simulación de actualización local
      this.currentUser = { ...this.currentUser!, name, email };
      // Actualizar AuthService para que el cambio se refleje en toda la app
      // Si AuthService expone un método, úsalo; si no, podrías agregar uno.
      // Por ahora asumimos que el user se guarda en localStorage via login,
      // aquí solo actualizamos en memoria.
      this.saving = false;
      this.editMode = false;
    }, 800);
  }
}
