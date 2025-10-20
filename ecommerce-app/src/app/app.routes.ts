import {Routes} from '@angular/router';
import  {HomeComponent} from './Pages/home/home.component';
import { Component } from '@angular/core';

export const routes:Routes=[
  {
    path:'',
    component:HomeComponent
  },
  {
    path:'products',
    loadComponent:()=> import ('./Pages/product-list/product-list.component').then(m=>m.ProductListComponent)
  },
  {
    path:'products/:id',
    loadComponent:()=> import('./Pages/product-detail/product.detail.component').then(m=>m.ProductDetailComponent)
  },
  {
    path:'cart',
    loadComponent:()=> import ('./Pages/cart/cart.component').then(m=>m.CartComponent)
  },
  //Asumiendo que tendrás estas rutas en el futuro para el login/registro
  //{path:'login',loadComponent:()=>import('./pages/login/login.component').then(m=>m.LoginComponent)},
  //{path:'register',loadComponent:()=>import('./pages/register/register.component').then(m=>m.RegisterComponent)},
  {
    path:'**',
    redirectTo:'',
    pathMatch:'full'
  }

];