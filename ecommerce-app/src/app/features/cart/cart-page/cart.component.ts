import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ImgFallbackDirective],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);

  items: any[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({
      next: (response) => {
        const items = response.items || response || [];
        this.items = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando carrito:', err);
        this.errorMessage = 'Error al cargar el carrito. Intenta más tarde.';
        this.isLoading = false;
      }
    });
  }

  get total(): number {
    return this.items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  }

  increase(item: any): void {
    const productId = item.product?._id;
    if (!productId) return;
    this.cartService.updateQuantity(productId, item.quantity + 1);
    item.quantity += 1;
  }

  decrease(item: any): void {
    const productId = item.product?._id;
    if (!productId || item.quantity <= 1) return;
    this.cartService.updateQuantity(productId, item.quantity - 1);
    item.quantity -= 1;
  }

  remove(item: any): void {
    const productId = item.product?._id;
    if (!productId) return;
    this.cartService.removeFromCart(productId);
    this.items = this.items.filter(i => i.product?._id !== productId);
  }

  goToCheckout(): void {
    if (!this.items.length) return;
    this.router.navigate(['/checkout']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
