import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Imports de Arquitectura
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.interface';

// Imports Visuales (Loader y Directiva)
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ImgFallbackDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  isLoading: boolean = true;
  quantity: number = 1; // <--- Variable que faltaba para el selector + / -

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: any) => { // 'any' temporal para flexibilidad
        this.product = product.data || product; // Adaptamos respuesta
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  addToCart() {
    if (!this.product || !this.product._id) return;

    // Llamamos al servicio con la cantidad seleccionada
    this.cartService.addToCart(this.product._id, this.quantity).subscribe({
      next: () => {
        alert('Producto agregado al carrito');
        // Opcional: Resetear cantidad o redirigir
      },
      error: (err) => console.error('Error agregando al carrito', err)
    });
  }
}