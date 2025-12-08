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
    createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}