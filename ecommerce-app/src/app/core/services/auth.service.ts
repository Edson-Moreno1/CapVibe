import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject,Observable,tap,map } from "rxjs";
import { User } from "../models/user.interface";
import { environment } from "../../../environments/environment"

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly apiUrl = `${environment.BACK_URL}/auth`;

    private _currentUser = new BehaviorSubject<User | null>(this.getUserFromStorage());

    public currentUser$ = this._currentUser.asObservable();

    constructor(private http: HttpClient) {}

    //Obtener valor actual sin suscribirse 
    get currentUserValue(): User | null{
        return this._currentUser.value;
    }

    //Verificar si hay sesion activa
    get isAuthenticated(): boolean{
        return !!this._currentUser.value;
    }

    //Obtener solo el token
    get token(): string | null{
        return this.currentUserValue?.token || null;
    }

    //Verificar si es admin
    get isAdmin() : boolean{
        return this.currentUserValue?.role === 'admin';
    }

    login(credentials: {email:string; password:string}): Observable<User>{
        return this.http.post<any>(`${this.apiUrl}/login`,credentials).pipe(
            map(response => {
                const user= response.user || response.data?.user || response;
                const token = response.token || response.data?.token;

                if (!user || !token){
                    throw new Error('La respuesta del servidor no contiene usuario o token');
                }
                const userWithToken: User = {...user, token};
                return userWithToken;
            }),
            tap(userWithToken =>{
                this.setUserToStorage(userWithToken);
            })
        );
    }
    register(userData: any): Observable<any>{
        return this.http.post(`${this.apiUrl}/register`,userData);
    }

    logout(): void{
        localStorage.removeItem('user_session');
        this._currentUser.next(null);
    }

    private setUserToStorage(user: User):void{
        localStorage.setItem('user_session', JSON.stringify(user));
        this._currentUser.next(user);
    }
    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem('user_session');
        try{
            return userJson ? JSON.parse(userJson): null;
        }catch(e){
            console.error('Error al recuperar sesiòn',e);
            return null;
        }
    }


}