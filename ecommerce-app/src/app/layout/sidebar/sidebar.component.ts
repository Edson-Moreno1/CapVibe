import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  currentUser: User | null = null;
  currentRole: string = '';
  displayMenu: any[] = [];

  menuItems = [
    { label: 'Mi Perfil', icon: 'bi-person-circle', route: '/profile', roles: ['cliente', 'admin'] },
    { label: 'Historial de Pedidos', icon: 'bi-bag-check', route: '/profile', roles: ['cliente'] },
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', route: '/admin/dashboard', roles: ['admin'] },
    { label: 'Crear Producto', icon: 'bi-plus-square-dotted', route: '/admin/create-product', roles: ['admin'] },
    { label: 'Inventario', icon: 'bi-box-seam', route: '/admin/dashboard', roles: ['admin'] },
  ];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.currentRole = user?.role || 'invitado';
      this.filterMenu();
    });
  }

  filterMenu() {
    this.displayMenu = this.menuItems.filter(item => 
      item.roles.includes(this.currentRole)
    );
  }

  logout() {
    this.authService.logout();
  }
}