import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../Models/products';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  currentIndex = 0;
  autoPlayInterval = 5000; // 5 segundos
  isAutoPlaying = true;
  
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.productService.getProducts(1).subscribe({
      next: (response) => {
        const sortedProducts = response.products.sort((a, b) => a.price - b.price);
        this.featuredProducts = sortedProducts.slice(0, 10);
      },
      error: (err) => {
        console.log('Error al cargar los productos destacados:', err);
      }
    });
  }

  prevSlide(): void {
    this.resetAutoPlay();
    const isFirstSlide = this.currentIndex === 0;
    this.currentIndex = isFirstSlide ? this.featuredProducts.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.resetAutoPlay();
    const isLastSlide = this.currentIndex === this.featuredProducts.length - 1;
    this.currentIndex = isLastSlide ? 0 : this.currentIndex + 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  private startAutoPlay(): void {
    if (!this.isAutoPlaying || this.featuredProducts.length <= 1) return;

    interval(this.autoPlayInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.nextSlide();
      });
  }

  private resetAutoPlay(): void {
    // Podrías agregar lógica para resetear el autoplay aquí si lo deseas
    // Por ahora solo evitamos errores
  }
}