import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../../Models/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Nos suscribimos al observable 'cart$' del servicio.
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotal(); // El total se recalcula con cada cambio.
    });
  }

  // El método para el input numérico, convierte el valor a número
  updateQuantity(productId: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = parseInt(inputElement.value, 10);
    
    // Validamos que la cantidad sea un número válido y mayor a 0
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    } else {
      // Si no es válido, restauramos la cantidad anterior del ítem
      const item = this.cartItems.find(i => i.product._id === productId);
      if (item) {
        inputElement.value = item.quantity.toString();
      }
    }
  }
  
  // Método para los botones + y -
  adjustQuantity(item: CartItem, amount: number): void {
    const newQuantity = item.quantity + amount;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.product._id, newQuantity);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  // Buena práctica: nos desuscribimos al destruir el componente.
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}