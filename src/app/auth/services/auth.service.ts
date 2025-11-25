import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../model/usuario.model';
import { environment } from '../../../environments/environment';

const USER_KEY = 'usuario_data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.baseUrl;
  usuario = signal<Usuario | null>(null);
  private tokenKey = 'authToken';

  http = inject(HttpClient);

  constructor(){
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        const user: Usuario = JSON.parse(savedUser);
        this.usuario.set(user);
      } catch (e) {
        console.error('Error al cargar usuario de localStorage', e);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('token');
      }
    }
  }

  /*constructor(private readonly http: HttpClient) {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        const user: Usuario = JSON.parse(savedUser);
        this.usuarioSubject.next(user);
      } catch (e) {
        console.error('Error al cargar usuario de localStorage', e);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('token');
      }
    }
  }*/

  login(login: string, password: string): Observable<Usuario> {
    const body = { username: login, password };

    return this.http.post<Usuario>(`${this.api}/api/usuarios/login`, body).pipe(
      tap((user) => {
        
        if (user?.token) {
          localStorage.setItem('token', user.token);
          this.setToken(user.token);  
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          this.usuario.set(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);

    // Limpiamos el estado
    this.usuario.set(null);
  }

  /**
   * Recupera el token de localStorage.
   */
  public get token(): string | null {
    return localStorage.getItem('token');
  }

  public get isLoggedIn(): boolean {
    return !!this.token && !!this.usuario;
  }

   private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  } 

  getToken(): string | null {
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }else {
      return null;
    }
  }
}
