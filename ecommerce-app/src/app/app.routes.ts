import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { exitGuard } from './core/guards/exit.guard';
// import { adminGuard } from './core/guards/admin.guard'; // Descomentar en Fase 5

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },

  // --- RUTAS DE AUTH (Solo si NO estás logueado? Eso lo refinaremos luego) ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // --- RUTAS PROTEGIDAS (Requieren Login) ---
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart-page/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard], 
    canDeactivate: [exitGuard], 
    loadComponent: () => import('./features/checkout/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'confirmation',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
  },

  // --- RUTAS DE ADMIN (FASE 5) ---
  /*
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  */

  {
    path: '**',
    redirectTo: ''
  }
];