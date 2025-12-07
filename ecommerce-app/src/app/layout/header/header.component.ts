import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// --- IMPORTS DE CORE (Arquitectura Nueva) ---
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.interface';

// --- IMPORTS LEGACY (Lo que aún no movemos a core) ---
import { CartService } from '../../core/services/cart.service';
// import { CartItem } from '../../Models/cart'; // <--- ELIMINADO PORQUE DABA ERROR

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  isLoggedIn: boolean = false;
  currentUser: User | null = null;
  
  private cartSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // --- LÓGICA DEL CARRITO ---
    // Usamos 'any[]' temporalmente para evitar errores de importación 
    // hasta que refactoricemos el modelo del carrito en Core.
    this.cartSubscription = this.cartService.cart$.subscribe((items: any[]) => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    // --- LÓGICA DE AUTH (CORREGIDA) ---
    // Escuchamos al BehaviorSubject del usuario actual
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      // Si 'user' tiene datos es true, si es null es false
      this.isLoggedIn = !!user; 
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if(this.authSubscription){
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}