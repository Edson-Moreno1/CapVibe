// src/app/core/services/cart.service.ts
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.BACK_URL}/cart`;

  private _cart = new BehaviorSubject<any[]>([]);
  public cart$ = this._cart.asObservable();

  constructor() {
    this.loadCartInitial();
  }

  getCart(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/`).pipe(
      tap(response => {
        const items = response.items || [];
        this._cart.next(items);
      })
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, { productId, quantity }).pipe(
      tap(() => {
        this.getCart().subscribe();
      })
    );
  }

  private loadCartInitial(): void {
    // Opcional: cargar carrito al iniciar
    // this.getCart().subscribe();
  }

  getTotal(): number {
    return this._cart.value.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  }

  removeFromCart(productId: string): void {
    this.http.delete<any>(`${this.baseUrl}/remove/${productId}`).pipe(
      tap(() => {
        this.getCart().subscribe();
      })
    ).subscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.http.put(`${this.baseUrl}/update/${productId}`, { quantity }).pipe(
      tap(() => {
        this.getCart().subscribe();
      })
    ).subscribe();
  }

  clearCart(): void {
    this.http.delete<any>(`${this.baseUrl}/clear`).pipe(
      tap(() => {
        this.getCart().subscribe();
      })
    ).subscribe();
  }
}
