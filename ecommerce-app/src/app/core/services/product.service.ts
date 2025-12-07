import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { Product } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})

export class ProductService{
    private http = inject(HttpClient);
    //private apiUrl = `${(environment as any).BACK_URL}/products`;
    private apiUrl = 'http://localhost:3000/api/products';

    getProducts(page:number =1,limit:number=10): Observable<ApiResponse<{products: Product[]}>>{
     
        return this.http.get<ApiResponse<{products:Product[]}>>(this.apiUrl);
    }

    getProductById(id:string): Observable<Product>{
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }
    // Métodos extra para admin (Rúbrica V.2 CRUD) se agregarán aquí luego
}