import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  //private apiUrl = `${environment.apiUrl}/categories`;
  private readonly apiUrl = 'http://localhost:3000/api/categories';
  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}