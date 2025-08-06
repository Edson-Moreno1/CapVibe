import { Component, OnInit } from '@angular/core';
import { Product } from '../../Models/products';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartItem } from '../../Models/cart';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderData } from '../../Models/orderdata';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm:FormGroup;
  cartItems:CartItem [] = [];
  submitted = false;
constructor(
  private formBuilder:FormBuilder,
  private cartService:CartService,
  private router:Router
){
  this.checkoutForm = this.formBuilder.group({
    nombre: ['',[Validators.required]],
    correo: ['',[Validators.required,Validators.email]],
    direccion: ['',[Validators.required]],
    ciudad: ['',[Validators.required]],
    estado: ['',[Validators.required]],
    codigopostal: ['',[Validators.required,Validators.pattern('[0-9]{5}')]],
  });
}
ngOnInit(): void {
  this.cartService.getCart().subscribe(items => {
    this.cartItems = items;
    if(items.length === 0){
      this.router.navigate(['/cart']);
    }
  });
}
get f() {return this.checkoutForm.controls;}
onSubmit (): void{
  this.submitted = true;
  if(this.checkoutForm.invalid){
    return;
  }

   const orderData: OrderData ={
    items: this.cartItems,
    total: this.getTotal(),
    shippingInfo: this.checkoutForm.value,
    orderNumber:this.generateOrderNumber(),
    date: new Date().toISOString()
   }
  
localStorage.setItem('orderData', JSON.stringify(orderData));
  this.cartService.clearCart();
  this.router.navigate(['/confirmation']);
}

getTotal(): number{
  return this.cartService.getTotal();

}
private generateOrderNumber(): string {
  return Math.random().toString(36).substring(2,10).toUpperCase();
}
}//end
