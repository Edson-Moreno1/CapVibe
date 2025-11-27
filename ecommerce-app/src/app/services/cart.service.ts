import { Injectable } from '@angular/core';
import { Product } from '../Models/products';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from '../Models/cart';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = `${environment.BACK_URL}/cart`;
  
  private cartItems: CartItem[] = [];
  
  constructor() { 
    this.loadCart();
  }
 private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);
readonly cart$ = this.cartSubject.asObservable();



  addToCart(product:Product,quantity:number =1): void{
    const existingItem = this.cartItems.find(item => item.product._id === product._id);

    if(existingItem){
      existingItem.quantity += quantity;
    }else{
      this.cartItems.push({product,quantity});
    }

    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product._id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }
  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product._id !== productId);
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
