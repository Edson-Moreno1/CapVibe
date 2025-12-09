import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Imports de Servicios
import { AuthService } from './core/services/auth.service';
import { LayoutService } from './core/services/layout.service';

// Imports de Componentes de Layout
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce-app';

  //  IMPORTANTE: Deben ser PUBLIC para usarse en el HTML
  public authService = inject(AuthService);
  public layoutService = inject(LayoutService);
}