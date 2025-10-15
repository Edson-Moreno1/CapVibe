import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../Models/api-response";
import { __param } from "tslib";

@Injectable({ providedIn:'root'})
export class ProductService{
  /*private apiUrl = 'http://localhost:3000/api/products';
*/
private apiUrl='https://super-duper-xylophone-q746qj579g4jhxrv7-3000.app.github.dev/api/products';
  constructor(private http:HttpClient){}
  /**
  
  * @param page
  */

  getProducts(page: number =1): Observable<ApiResponse>{
    const params = { page:page.toString()};
    return this.http.get<ApiResponse>(this.apiUrl,{params});
  }
  }