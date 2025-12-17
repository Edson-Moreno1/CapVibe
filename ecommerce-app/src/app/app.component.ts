import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LayoutService } from './core/services/layout.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Inyecta los servicios correctamente
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);

  // Propiedades públicas para el template
  isSidebarVisible$ = this.layoutService.isSidebarVisible$;
  isLoggedIn = false;

  ngOnInit(): void {
    // Suscríbete al estado de autenticación
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      
      // Cierra el sidebar si el usuario no está logueado
      if (!user) {
        this.layoutService.closeSidebar();
      }
    });
  }
}