import {inject} from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../app/services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";

export const adminGuard:CanActivateFn = (route,state)=>{

    const authService = inject(AuthService);
    const router = inject(Router);
    const jwtHelper = inject(JwtHelperService);

    const token = authService.getToken();

    if(!token) {
        console.error('AdminGuard: No hay token.Redirigiendo a /login.');
        router.navigate(['/login']);
    }
}