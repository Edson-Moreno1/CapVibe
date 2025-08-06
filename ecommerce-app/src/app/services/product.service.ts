import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../Models/products';
import { PRODUCTOS } from '../Models/productos';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }
//Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return of(PRODUCTOS as Product[]);
  }

//Obtener un producto por id

  getProductById(id: number): Observable<Product | undefined> {
    const product= PRODUCTOS.find(p=>p.id ===id);
    return of(product);
  }


  searchProducts(term: string): Observable<Product[]> {
    if(!term.trim()){
      return this.getProducts();
    }
    const filteredProducts = PRODUCTOS.filter(product => product.name.toLowerCase().
      includes(term.toLowerCase()) || product.description.toLowerCase().includes(term.toLowerCase()));
    return of(filteredProducts);
  }
}
