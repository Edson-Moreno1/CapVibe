import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Core & Shared
import { CartService } from '../../../core/services/cart.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ImgFallbackDirective],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  
  cartItems: any[] = [];
  total: number = 0;
  isLoading: boolean = false;
  private cartSubscription!: Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    
    this.cartSubscription = this.cartService.cart$.subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

    this.cartService.getCart().subscribe();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => {
      const price = item.product?.price || 0; 
      return acc + (price * item.quantity);
    }, 0);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string) {
    // Usamos confirm nativo o podrías usar un modal de DaisyUI
    if(confirm('¿Eliminar producto?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
  }
}