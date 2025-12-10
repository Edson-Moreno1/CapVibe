import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.interface';
import { Category } from '../../core/models/category.interface';

// Importa Swiper
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

  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  loadingCategories = true;

  // Para el carrusel manual
  currentIndex = 0;
  private intervalId: any;

  // Testimonios
  testimonials = [
    {
      name: 'Carlos Rodríguez',
      rating: 5,
      comment: 'Excelente calidad, las gorras llegan en perfectas condiciones. Totalmente recomendado.',
      avatar: 'C'
    },
    {
      name: 'María González',
      rating: 5,
      comment: 'Gran variedad de diseños. El envío fue rápido y el empaque impecable.',
      avatar: 'M'
    },
    {
      name: 'Luis Martínez',
      rating: 4,
      comment: 'Buena experiencia de compra. Las gorras son auténticas y de alta calidad.',
      avatar: 'L'
    }
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
  
  this.productService.getProducts().subscribe({
    next: (response) => {
      // Maneja diferentes formatos de respuesta
      let products: Product[] = [];
      
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (Array.isArray(response)) {
        products = response;
      }
      
      // Productos destacados (primeros 8)
      this.featuredProducts = products.slice(0, 8);
      
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading products:', error);
      this.loading = false;
      this.featuredProducts = [];
    }
  });
}
  loadCategories(): void {
    this.loadingCategories = true;
    
    this.http.get<any>('http://localhost:3000/api/categories').subscribe({
      next: (response) => {
        this.categories = response.data || response || [];
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
        
        // Fallback: categorías por defecto
        this.categories = [
  { 
    _id: '1', 
    name: 'MLB', 
    description: 'Gorras de las Ligas Mayores de Béisbol',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    _id: '2', 
    name: 'NBA', 
    description: 'Gorras de la Asociación Nacional de Baloncesto',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    _id: '3', 
    name: 'LMB', 
    description: 'Gorras de la Liga Mexicana de Béisbol',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    _id: '4', 
    name: 'Liga MX', 
    description: 'Gorras de la primera división de fútbol mexicano',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
      }
    });
  }

  // Métodos del carrusel
  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.featuredProducts.length;
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 
      ? this.featuredProducts.length - 1 
      : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia cada 5 segundos
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getCategoryImage(index: number): string {
    const defaultImages = [
      'assets/img1.png',
      'assets/img2.png',
      'assets/img3.png',
      'assets/img4.png',
      'assets/img5.png',
      'assets/img6.png',
      'assets/img7.png',
      'assets/img8.png'
    ];
    
    return defaultImages[index % defaultImages.length];
  }

  getCategoryRoute(categoryName: string): string {
    return `/products?category=${encodeURIComponent(categoryName)}`;
  }
}