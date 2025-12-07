import { Component,OnInit,inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
//Imports de servicios y modelos
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.interface';
import { ApiResponse } from '../../../core/models/api-response.interface'
import { CartService } from '../../../core/services/cart.service';
import { ImgFallbackDirective } from "../../../shared/directives/img-fallback.directive";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";


@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule,LoaderComponent,ImgFallbackDirective, RouterModule],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],  
})

export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products: Product[] = [];
  isLoading: boolean = false;
  errorMessage:string ='';

  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.loadProducts();
  }


  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.itemsPerPage).subscribe({
      next:(response:any) =>{
        this.products = response.products || response.data || [];
        this.totalPages = response.totalPages || 1;
        this.isLoading = false;
        window.scrollTo({top:0, behavior: 'smooth'});
      },
      error:(err)=>{
        console.error('Error cargando productos:', err);
        this.errorMessage = 'Error al cargar los productos. Intente más tarde.';
        this.isLoading = false;
      }
    });
  }

    changePage(newPage:number){
      if(newPage <1 && newPage <= this.totalPages && newPage !== this.currentPage){
        this.currentPage = newPage;
        this.loadProducts();
      }
    }

  addToCart(product: Product){
    if(!product._id) return;

    this.cartService.addToCart(product._id,1).subscribe({
      next:()=> console.log(`Producto ${product.name} agregado!`),
      error:(err)=> console.error('Error al agregar al carrito',err)   
    });
  }
}