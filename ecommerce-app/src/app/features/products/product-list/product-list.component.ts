import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";

import { ProductService } from "../../../core/services/product.service";
import { Product } from "../../../core/models/product.interface";
import { Category } from "../../../core/models/category.interface";
import { CartService } from "../../../core/services/cart.service";
import { ImgFallbackDirective } from "../../../shared/directives/img-fallback.directive";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, LoaderComponent, ImgFallbackDirective, RouterModule],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = "";

  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 12;

  currentCategory: string | null = null;

  ngOnInit(): void {
    // Escuchar cambios en query params (category)
    this.route.queryParamMap.subscribe(params => {
      this.currentCategory = params.get('category');
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.productService.getProducts(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        const all: Product[] = response.products || response.data || [];
        this.products = all;

        // aplicar filtro por categoría si existe
        if (this.currentCategory) {
          const categoryLower = this.currentCategory.toLowerCase();
          this.filteredProducts = this.products.filter(p => {
            if (!p.category) return false;
            if (typeof p.category === 'string') {
              return p.category.toLowerCase() === categoryLower;
            }
            return p.category.name.toLowerCase() === categoryLower;
          });
        } else {
          this.filteredProducts = this.products;
        }

        this.totalPages = response.totalPages || 1;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error("Error cargando productos:", err);
        this.errorMessage = "Error al cargar los productos. Intente más tarde.";
        this.isLoading = false;
      },
    });
  }

  changePage(newPage: number): void {
    if (
      newPage >= 1 &&
      newPage <= this.totalPages &&
      newPage !== this.currentPage
    ) {
      this.currentPage = newPage;
      this.loadProducts();
    }
  }

  getPageNumbers(): number[] {
    const maxVisible = 5;
    const pages: number[] = [];

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisible / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Type guard para usar en el template
  isCategoryObject(
    category: string | Category | undefined
  ): category is Category {
    return !!category && typeof category !== "string";
  }

  applyCategoryFilter(category: string | null): void {
    this.router.navigate(['/products'], {
      queryParams: { category: category || null },
      queryParamsHandling: 'merge'
    });
  }

  addToCart(product: Product): void {
    if (!product._id || (product.stock ?? 0) === 0) return;

    if (!this.authService.isAuthenticated) {
      this.router.navigate(["/login"], {
        queryParams: { redirectTo: `/products/${product._id}` },
      });
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        console.log(`Producto ${product.name} agregado al carrito`);
      },
      error: (err) => {
        console.error("Error al agregar al carrito", err);
        alert("Error al agregar el producto. Intenta nuevamente.");
      },
    });
  }
}
