import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  checkoutForm: FormGroup;
  cartItems: any[] = [];
  totalPrice: number = 0;
  isLoading: boolean = false;
  private cartSubscription!: Subscription;

  constructor() {
    this.checkoutForm = this.fb.group({
      contact: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]]
      }),
      shipping: this.fb.group({
        direccion: ['', Validators.required],
        ciudad: ['', Validators.required],
        estado: ['', Validators.required],
        codigopostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
      }),
      payment: this.fb.group({
        metodo: ['tarjeta', Validators.required],
        numeroTarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
        expiracion: ['', Validators.required],
        cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
      })
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe((items: any[]) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotal();
      if (items.length === 0) {
        // this.router.navigate(['/products']); // Descomentar si quieres redirigir cuando el carrito está vacío
      }
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.checkoutForm.value;

    const orderPayload = {
      shippingAddress: {
        address: formData.shipping.direccion,
        city: formData.shipping.ciudad,
        state: formData.shipping.estado,
        postalCode: formData.shipping.codigopostal,
        country: 'Mexico'
      },
      paymentMethod: formData.payment.metodo,
      items: this.cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: this.totalPrice
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (response: any) => {
        this.clearCart();
        this.isLoading = false;
        const orderCreated = response.order || response.data || response;
        this.router.navigate(['/confirmation'], { state: { order: orderCreated } });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('Error al procesar el pedido.');
      }
    });
  }

  private clearCart(): void {
    this.cartItems.forEach(item => {
      if (item.product?._id) {
        this.cartService.removeFromCart(item.product._id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
