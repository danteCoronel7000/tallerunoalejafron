import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse, Usuario } from '../interfaces/usuario-ges.interface';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  baseUrl = environment.baseUrl + '/api/usuarios';
  url = environment.baseUrl+'';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.error(
        "TOKEN NO ENCONTRADO. Verifique si la clave 'token' es correcta o si la sesión ha expirado."
      );
    }

    return headers;
  }

  // GET
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

// GET: paginado
// Método para obtener usuarios paginados
getUsuariosPaginados(
  page: number = 0,
  size: number = 4,
  sortBy: string = 'login',
  sortDir: string = 'asc'
): Observable<PageableResponse<Usuario>> {

  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sortBy', sortBy)
    .set('sortDir', sortDir);


  return this.http.get<PageableResponse<Usuario>>(`${this.url}/get/paginado`, {
    params,
    headers: this.getAuthHeaders()
  });
}

  // POST
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario, {
      headers: this.getAuthHeaders(),
    });
  }

  // PUT: /api/usuarios/password/{login}
  modificarPassword(login: string, newPassword: string): Observable<string> {
    const body = { password: newPassword };
    return this.http.put(`${this.baseUrl}/password/${login}`, body, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  // PUT: /api/usuarios/estado/{login}/{nuevoEstado}
cambiarEstadoUsuario(login: string, estado: number): Observable<string> {
  return this.http.put(`${this.baseUrl}/estado/${login}/${estado}`, null, {
    headers: this.getAuthHeaders(),
    responseType: 'text',
  });
}

  // DELETE: /api/usuarios/{login}
  eliminarUsuario(login: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${login}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }
}
