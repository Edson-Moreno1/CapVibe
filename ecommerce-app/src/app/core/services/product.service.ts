import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import { Product } from '../models/product.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    
    private readonly apiUrl = `${environment.BACK_URL}/products`;

   // src/app/core/services/product.service.ts
    getProducts(page = 1, limit = 10, options?: { isFeatured?: boolean }) {
  const params: any = { page, limit };

  if (options?.isFeatured) {
    params.isFeatured = 'true';
  }

  // Llamar directamente a /api/products
  return this.http.get<any>(this.apiUrl, { params });
}



    getProductById(id: string): Observable<Product> {
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