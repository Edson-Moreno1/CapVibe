import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../Models/api-response";

@Injectable({ providedIn:'root'})
export class ProductService{
  private apiUrl = 'http://localhost:3000/api/products';
  constructor(private http:HttpClient){}

  getProducts():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.apiUrl);
  }
}