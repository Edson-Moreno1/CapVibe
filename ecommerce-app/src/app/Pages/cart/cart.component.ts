import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartService} from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../Models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;

    });
  }

  updateQuantity(productId:number, quantity:number): void{
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number): void{
    this.cartService.removeFromCart(productId);
  }
  getTotal(): number {

    return this.cartService.getTotal();
  }

}//end
