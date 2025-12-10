import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.interface';
import { Category } from '../../core/models/category.interface';
import { environment } from '../../../environments/environment';

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
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private http = inject(HttpClient);

  featuredProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  loadingCategories = true;

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
  }

  loadProducts(): void {
    this.loading = true;
    
    this.productService.getProducts().subscribe({
      next: (response) => {
        const products = response.data || [];
        
        // Productos destacados (primeros 8)
        this.featuredProducts = products.slice(0, 8);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        
        // Productos de ejemplo en caso de error (para desarrollo en StackBlitz)
        this.featuredProducts = [];
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    
    this.http.get<any>(`${environment.apiUrl}/categories`).subscribe({
      next: (response) => {
        // La API puede devolver { success: true, data: [...] } o directamente el array
        this.categories = response.data || response || [];
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
        
        // Fallback: categorías por defecto si falla la API (útil para desarrollo)
        this.categories = [
          { 
            _id: '1', 
            name: 'Snapback', 
            description: 'Clásicas y ajustables',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          { 
            _id: '2', 
            name: 'Dad Hats', 
            description: 'Estilo relajado',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          { 
            _id: '3', 
            name: 'Trucker', 
            description: 'Ventiladas y frescas',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          { 
            _id: '4', 
            name: 'Fitted', 
            description: 'Ajuste perfecto',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  // Método para obtener imagen de categoría (usa imágenes por defecto)
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

  // Método para construir la ruta de filtro por categoría
  getCategoryRoute(categoryName: string): string {
    return `/products?category=${encodeURIComponent(categoryName)}`;
  }
}