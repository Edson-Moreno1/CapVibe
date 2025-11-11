import { inject } from "@angular/core";
import { CanActivateFn,Router } from "@angular/router";
import { AuthService } from "../app/services/auth.service";
import { tap } from "rxjs";
import { Observable } from "rxjs";

export const authGuard:CanActivateFn = (route,state) =>{
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn$.pipe(
        tap(isLoggedIn =>{
            if(!isLoggedIn){
        console.log('AuthGuard: Acceso DENEGADO. Redirigiendo a /Login...');
        router.navigate(['/login']);
        }else{
            console.log('AuthGuard: Acceso CONCEDIDO.');
            }
        })
    );
};
