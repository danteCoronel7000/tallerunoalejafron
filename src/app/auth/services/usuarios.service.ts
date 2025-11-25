import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Personal, Usuario } from '../model/usuario.model';
import { environment } from '../../../environments/environment';

interface PasswordUpdate {
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly api = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  //GET
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/api/usuarios`);
  }

  //POST
  createUsuario(
    usuarioData: Usuario & {personal: Personal}
  ): Observable<boolean> {
    const url = `${this.api}/api/usuarios`;
    return this.http.post<void>(url, usuarioData).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al crear usuario:', error);
        return of(false);
      })
    );
  }

  //PUT
  updatePassword(login: string, newPassword: string): Observable<boolean> {
    const url = `${this.api}/api/usuarios/password/${encodeURIComponent(
      login
    )}`;

    const changes: PasswordUpdate = { newPassword: newPassword };

    return this.http.put<void>(url, changes).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error al modificar password para ${login}:`, error);
        return of(false);
      })
    );
  }

  //PUT
  updateUsuario(
    login: string,
    changes: Pick<Usuario, 'password' | 'estado'>
  ): Observable<boolean> {
    const url = `${this.api}/api/usuarios/${encodeURIComponent(login)}`;
    return this.http.put<void>(url, changes).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error al actualizar usuario ${login}:`, error);
        return of(false);
      })
    );
  }

  //DELETE
  deleteUsuario(login: string): Observable<boolean> {
    const url = `${this.api}/api/usuarios/${encodeURIComponent(login)}`;
    return this.http.delete<void>(url).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error al eliminar usuario ${login}:`, error);
        return of(false);
      })
    );
  }
}
