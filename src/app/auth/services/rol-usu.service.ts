import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Se elimina HttpHeaders
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolUsuService {
  private api = environment.baseUrl;

  constructor(private http: HttpClient) {}

  asignar(login: string, codr: number): Observable<Usuario> {
    const params = new HttpParams()
      .set('login', login)
      .set('codr', codr.toString());

    return this.http.post<Usuario>(`${this.api}/rolusu/asignar`, null, {
      params,
    });
  }

  eliminar(login: string, codr: number): Observable<Usuario> {
    const params = new HttpParams()
      .set('login', login)
      .set('codr', codr.toString());

    return this.http.delete<Usuario>(`${this.api}/rolusu/eliminar`, {
      params,
    });
  }
}
