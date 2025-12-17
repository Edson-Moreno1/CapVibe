import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.interface';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../core/models/category.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ImgFallbackDirective, LoaderComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  product: Product | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Producto no encontrado.';
      return;
    }
    this.loadProduct(id);
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        this.product = response.product || response.data || response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        this.errorMessage = 'Error al cargar el producto. Intente más tarde.';
        this.isLoading = false;
      },
    });
  }

  addToCart(): void {
    if (!this.product || !this.product._id || (this.product.stock ?? 0) === 0) return;

    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: `/products/${this.product._id}` }
      });
      return;
    }

    this.cartService.addToCart(this.product._id, 1).subscribe({
      next: () => {
        console.log(`Producto ${this.product?.name} agregado al carrito`);
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
        alert('Error al agregar el producto. Intenta nuevamente.');
      },
    });
  }

  getMainImage(): string {
    return this.product?.images?.[0] || '/assets/img1.png';
  }

  isCategoryObject(category: string | Category | undefined): category is Category {
    return !!category && typeof category !== 'string';
  }
}
