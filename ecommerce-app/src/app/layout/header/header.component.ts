import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { CartItem } from '../../Models/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Nos suscribimos al observable del carrito
    this.cartSubscription = this.cartService.cart$.subscribe((items: CartItem[]) => {
      // Sumamos la 'quantity' de cada item para obtener el total de productos
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    // Limpiamos la suscripción al destruir el componente
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}