import { Component,OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductService } from "../../services/product.service";
import { RouterLink } from "@angular/router";
import { Product } from "../../Models/products";
import { ApiResponse } from "../../Models/api-response";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],  
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.getProducts().subscribe({
          next:(response:ApiResponse) =>{
            this.products = response.products;
            console.log('Respuesta completa de la API:', response);
            console.log('productos extraidos para la vista:', this.products);
          },
          error:(err) =>{
            console.log('Error al obtener los productos:', err);
          }
        });
    }

    addToCart(product: any) {
      console.log('Añadiendo al carrito (funcion temporal):', product);
    }
}