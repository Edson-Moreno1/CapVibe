import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../Models/products';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  product: Product | undefined;
  loading: boolean = true;
  error: string | null = null; 
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService:CartService
  ) { }

  ngOnInit(): void {
    this.loadProductDetails();
  }

  loadProductDetails(): void {
    const productId= this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.loading = false;
      this.error = 'Error: ID de producto no encontrado en la URL.';
      return;
    }
    this.productService.getProductById(productId).subscribe({
      next:(data)=>{
        this.product = data;
        this.loading = false;
      },
      error:(err)=>{
        console.error('Error al cargar los detalles del producto:', err);
        this.error = 'No se pudo cargr el producto.Intente màs tarde.';
        this.loading = false;
      }
    });
  }
  addToCart(product: Product): void {
    if (product){
      this.cartService.addToCart(product);
      console.log('Producto agregado desde Detalle:', product.name);
    }
}
}