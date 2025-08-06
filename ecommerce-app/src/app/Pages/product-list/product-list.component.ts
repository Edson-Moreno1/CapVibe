import { Component,OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../Models/products';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule,RouterModule],
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products: Product[] = [];

  constructor(private productService: ProductService,private cartService:CartService){}

ngOnInit(): void {
  
  this.loadProducts();
}

loadProducts():void {
  this.productService.getProducts().subscribe(products => {this.products =products;});
}

addToCart(product:Product):void{
  this.cartService.addToCart(product);
}

} //end
