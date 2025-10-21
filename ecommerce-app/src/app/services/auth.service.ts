import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

 
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() {
    
  }


  login(): void {
    console.log('Simulando login...');
    this.loggedIn.next(true); 
  }

  // Simula un cierre de sesión
  logout(): void {
    console.log('Simulando logout...');
    this.loggedIn.next(false); 
  }
}