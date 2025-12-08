import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // <--- Vital para Rúbrica III.5
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Imports de Arquitectura (Core y Shared)
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent], // Agregamos ReactiveFormsModule
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  // Inyecciones modernas
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  // Variables de Estado
  checkoutForm: FormGroup;
  cartItems: any[] = []; // Usamos 'any' o 'CartItem' según tengas tu interfaz
  totalPrice: number = 0;
  isLoading: boolean = false;
  private cartSubscription!: Subscription;

  constructor() {
    // Definición del Formulario (Dirección + Pago)
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
    // Suscripción al carrito para calcular total y validar si está vacío
    this.cartSubscription = this.cartService.cart$.subscribe((items: any[]) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotal();

      // Si recarga la página y el carrito está vacío, lo regresamos al catálogo
      if (items.length === 0) {
        // Opcional: this.router.navigate(['/products']);
      }
    });
  }

  // --- LÓGICA DE ENVÍO (Rúbrica II.4) ---
  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched(); // Muestra los errores rojos en los inputs
      return;
    }

    this.isLoading = true;
    const formData = this.checkoutForm.value;

    // 1. Preparamos el objeto para el Backend
    // (Asegúrate de que coincida con lo que espera tu API de Node)
    const orderPayload = {
      shippingAddress: {
        address: formData.shipping.direccion,
        city: formData.shipping.ciudad,
        state: formData.shipping.estado,
        postalCode: formData.shipping.codigopostal,
        country: 'Mexico'
      },
      paymentMethod: formData.payment.metodo,
      // Mapeamos los items para enviar solo lo necesario (ID, cantidad, precio)
      items: this.cartItems.map(item => ({
        product: item.product._id, // Ojo aquí con el acceso al ID
        quantity: item.quantity,
        price: item.product.price
      })),
      total: this.totalPrice
    };

    // 2. Enviamos la orden
    this.orderService.createOrder(orderPayload).subscribe({
      next: (response: any) => {
        console.log('Orden creada con éxito:', response);
        
        // 3. Limpiamos el carrito (Visual y Lógico)
        this.clearCart();
        
        this.isLoading = false;

        // 4. Redirigimos a Confirmación pasando los datos de la orden
        const orderCreated = response.order || response.data || response;
        this.router.navigate(['/confirmation'], { state: { order: orderCreated } });
      },
      error: (err) => {
        console.error('Error al procesar la orden:', err);
        this.isLoading = false;
        alert('Hubo un error al procesar tu pago. Intenta nuevamente.');
      }
    });
  }

  private clearCart() {
    // Eliminamos cada item del carrito usando el servicio
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