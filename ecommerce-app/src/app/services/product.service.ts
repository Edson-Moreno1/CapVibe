import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../Models/api-response";
import { __param } from "tslib";
import { Product } from "../Models/products";
import { environment } from "../../environments/environment.development";

@Injectable({ providedIn:'root'})
export class ProductService{
  
  private baseUrl = `${environment.BACK_URL}/products`;
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http:HttpClient){}
  /**
  
  * @param page
  */

  getProducts(page: number =1): Observable<ApiResponse>{
    const params = { page:page.toString()};
    return this.http.get<ApiResponse>(this.apiUrl,{params});
  }
/** 
 * 
 * @param id
 */ 

  getProductById(id:string):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  }