import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  private router = inject(Router);

  order: any = null;

  ngOnInit(): void {
    // Intentar leer la orden desde el state de la navegación
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras?.state?.['order'] || history.state?.order || null;

    // Opcional: si no hay order, podrías redirigir al home o a /orders
    // if (!this.order) {
    //   this.router.navigate(['/']);
    // }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToOrders(): void {
    this.router.navigate(['/profile']); // o '/orders' si tienes una sección de pedidos
  }
}
