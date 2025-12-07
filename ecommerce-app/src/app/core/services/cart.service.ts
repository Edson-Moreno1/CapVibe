import { Injectable,inject  } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject,Observable,tap } from "rxjs";
import { environment } from "../../../environments/environment";
// Usaremos 'any' en items por ahora hasta que definamos la interfaz CartItem estricta
// para no bloquearte.

@Injectable({
    providedIn: 'root'
})

export class CartService {
    private http= inject(HttpClient);
    private apiUrl = `${(environment as any).BACK_URL}/cart`;

    private _cart = new BehaviorSubject<any[]>([]);
    public cart$ = this._cart.asObservable();

    constructor(){
        this.loadCartInitial();
    }

    getCart(): Observable<any>{
        return this.http.get<any>(this.apiUrl).pipe(
            tap(response =>{
                const items = response.items || [];
                this._cart.next(items);
            })
        );
    }

    addToCart(productId: string, quantity: number =1): Observable<any>{
        return this.http.post<any>(this.apiUrl,{productId, quantity}).pipe(
            tap(()=>{
                this.getCart().subscribe();
            })
        );
    }

    private loadCartInitial(){

    }

    getTotal(): number{
        return this._cart.value.reduce((total,item)=>{
            return total + (item.product?.price || 0)*item.quantity;
        },0);
    }

    removeFromCart(productId: string):void{
        this.http.delete<any>(`${this.apiUrl}/${productId}`).pipe(
            tap(()=>{
                this.getCart().subscribe();
            })
        ).subscribe();
    }

    updateQuantity(productId: string, quantity: number): void{
        if (quantity <1) return;
        this.http.put(this.apiUrl,{productId,quantity}).pipe(
            tap(()=>{
                this.getCart().subscribe();
            })
        ).subscribe();
    }
}