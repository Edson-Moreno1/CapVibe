import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import { Product } from '../models/product.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    // Ajusta esto si usas variables de entorno o hardcode
    // private apiUrl = `${(environment as any).BACK_URL}/products`;
    private apiUrl = 'http://localhost:3000/api/products';

    getProducts(page: number = 1, limit: number = 10): Observable<ApiResponse<{products: Product[]}>> {
        // CORRECCIÓN: Ahora sí enviamos los parámetros al backend
        const url = `${this.apiUrl}?page=${page}&limit=${limit}`;
        return this.http.get<ApiResponse<{products:Product[]}>>(url);
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