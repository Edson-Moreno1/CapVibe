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

  currentPage: number = 1;
  totalPages: number = 0;



  constructor(private productService: ProductService) {}

  ngOnInit(): void{
    this.loadProducts();
  }
    loadProducts():void{
      this.productService.getProducts(this.currentPage).subscribe({
        next:(response:ApiResponse)=>{
          this.products=response.products;
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          console.log('Pahina actual:',this.currentPage,'de',this.totalPages);
        },
        error:(err)=>{
          console.log('Error al obtener los productos:',err);
        }

      });
    }
   
    

    nextPage(): void{
      if(this.currentPage<this.totalPages){
        this.currentPage++;
        this.loadProducts();
      }
    }
    previousPage(): void{
      if(this.currentPage>1){
        this.currentPage--;
        this.loadProducts();
      }
    }

    addToCart(product: any) {
      console.log('Añadiendo al carrito (funcion temporal):', product);
    }
}