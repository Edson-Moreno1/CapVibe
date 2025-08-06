import { Injectable } from '@angular/core';
import { Product } from '../Models/products';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from '../Models/cart';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() { 
    this.loadCart();
  }

  getCart(): Observable<CartItem[]>{
    return this.cartSubject.asObservable();
  }

  addToCart(product:Product,quantity:number =1): void{
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if(existingItem){
      existingItem.quantity += quantity;
    }else{
      this.cartItems.push({product,quantity});
    }

    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }
  getTotal(): number {
    return this.cartItems.reduce((total,item) => {
      return total + (item.product.price * item.quantity);
    },0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse (savedCart);
      this.cartSubject.next([...this.cartItems]);
    }
  }

 
}// end
