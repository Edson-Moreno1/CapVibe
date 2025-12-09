import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderData } from '../../../core/models/order.interface';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {
  order: OrderData | null = null;

  constructor(private router: Router) {
    // Recuperar datos pasados por el router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['order']) {
      this.order = navigation.extras.state['order'];
    }
  }

  ngOnInit(): void {
    // Si no hay orden (acceso directo por URL), redirigir
    /* if (!this.order) {
       this.router.navigate(['/']);
    } */
  }
}