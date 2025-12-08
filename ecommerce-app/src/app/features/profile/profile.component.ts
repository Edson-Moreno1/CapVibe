import { Component,OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/models/user.interface';
import { OrderData } from '../../core/models/order.interface';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService)
  private orderService = inject(OrderService)

  currentUser: User | null = null;
  orders: OrderData[] = []
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    //Obetner datos del usuario actual
    this.authService.currentUser$.subscribe(user=>{
      this.currentUser = user;
    });
    //Cargar historial de compras
    this.loadOrders();
  }

  loadOrders(){
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (response:any)=>{
        this.orders = response.orders || response.data || (Array.isArray(response)? response:[]);
        this.isLoading = false;
      },
      error: (err) =>{
        console.error('Error cargando órdenes:', err);
        if (err.status !==404){
          this.errorMessage = 'No se pudo cargar el historial de compras.';
        }
        this.isLoading = false;
      }
    });
  }

}
