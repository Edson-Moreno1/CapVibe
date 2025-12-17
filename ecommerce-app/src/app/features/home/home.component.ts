import { Component, OnInit, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.interface';
import { Category } from '../../core/models/category.interface';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

// Swiper
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  loadingCategories = true;

  currentIndex = 0;
  private intervalId: any;

  testimonials = [
    { name: 'Carlos Rodríguez', rating: 5, comment: 'Excelente calidad, las gorras llegan en perfectas condiciones. Totalmente recomendado.', avatar: 'C' },
    { name: 'María González', rating: 5, comment: 'Gran variedad de diseños. El envío fue rápido y el empaque impecable.', avatar: 'M' },
    { name: 'Luis Martínez', rating: 4, comment: 'Buena experiencia de compra. Las gorras son auténticas y de alta calidad.', avatar: 'L' }
  ];

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts(1, 8, { isFeatured: true }).subscribe({
      next: (response) => {
        let products: Product[] = [];

        if (Array.isArray(response.products)) {
          products = response.products;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        } else if (Array.isArray(response)) {
          products = response;
        }

        this.featuredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
        this.featuredProducts = [];
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;

    this.http.get<any>(`${environment.BACK_URL}/categories`).subscribe({
      next: (response) => {
        this.categories = response.data || response || [];
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
        // opcional: puedes dejar categories con fallback
      }
    });
  }

  nextSlide(): void {
    if (!this.featuredProducts.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.featuredProducts.length;
  }

  prevSlide(): void {
    if (!this.featuredProducts.length) return;
    this.currentIndex =
      this.currentIndex === 0
        ? this.featuredProducts.length - 1
        : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getCategoryImage(index: number): string {
    const defaultImages = [
      'assets/categories/mlb.webp',
      'assets/categories/nba.webp',
      'assets/categories/f1.webp',
      'assets/categories/ligamx.webp'
    ];
    return defaultImages[index % defaultImages.length];
  }

  addToCartFromHome(product: Product): void {
    if (!product._id || (product.stock ?? 0) === 0) return;

    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: `/products/${product._id}` }
      });
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        console.log(`Producto ${product.name} agregado al carrito desde home`);
      },
      error: (err) => {
        console.error('Error al agregar al carrito', err);
        alert('Error al agregar el producto. Intenta nuevamente.');
      }
    });
  }
}
