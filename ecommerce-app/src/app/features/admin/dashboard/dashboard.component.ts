import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Imports de Core y Shared
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ImgFallbackDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadProducts();
  }
toggleFeatured(product: Product): void {
  const newValue = !product.isFeatured;

  this.isLoading = true;

  this.productService.updateProduct(product._id, { isFeatured: newValue }).subscribe({
    next: (updated: Product) => {
      product.isFeatured = updated.isFeatured ?? newValue;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error actualizando destacado:', err);
      alert('No se pudo actualizar el estado de destacado.');
      this.isLoading = false;
    }
  });
}
  loadProducts() {
    this.isLoading = true;
    // Pedimos 100 productos para ver todo el inventario de una vez
    this.productService.getProducts(1, 100).subscribe({
      next: (response: any) => {
        this.products = response.products || response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al cargar inventario.';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('⚠️ ¿Estás seguro de ELIMINAR este producto?\nEsta acción es irreversible.')) {
      this.isLoading = true;
      
      // Llamada al servicio (Asegúrate de tener este método en ProductService, si no, lo agregamos abajo)
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // Filtramos la lista localmente para no tener que recargar todo
          this.products = this.products.filter(p => p._id !== id);
          this.isLoading = false;
          alert('Producto eliminado correctamente.');
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo eliminar el producto.');
          this.isLoading = false;
        }
      });
    }
  }
}
