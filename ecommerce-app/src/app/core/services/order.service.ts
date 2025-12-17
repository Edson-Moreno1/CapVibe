import {Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { OrderData } from '../models/order.interface';

@Injectable({
    providedIn: 'root'
})

export class OrderService{
    private http = inject(HttpClient)
    private readonly apiUrl = `${environment.BACK_URL}/orders`;
    //Obtener el historial de ordenes de los usuarios 
    getMyOrders(): Observable<ApiResponse<OrderData[]>>{
        return this.http.get<ApiResponse<OrderData[]>>(`${this.apiUrl}/my-orders`);
    }

    //Obtener detalle de una orden
    getOrderById(id:string):Observable<ApiResponse<OrderData>>{
        return this.http.get<ApiResponse<OrderData>>(`${this.apiUrl}/${id}`);
    }

    //Crear orden 
    createOrder(order:any):Observable<ApiResponse<OrderData>>{
        return this.http.post<ApiResponse<OrderData>>(this.apiUrl,order);
    }
}