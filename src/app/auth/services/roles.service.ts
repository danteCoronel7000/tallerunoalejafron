import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../model/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private api = environment.baseUrl;
  private resourceUrl = `${this.api}/api/roles`;

  constructor(private http: HttpClient) {}

  list(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.resourceUrl);
  }

  get(codr: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.resourceUrl}/${codr}`);
  }

  create(rol: Pick<Rol, 'nombre' | 'estado'>): Observable<void> {
    return this.http.post<void>(this.resourceUrl, rol);
  }

  update(codr: number, rol: Pick<Rol, 'nombre' | 'estado'>): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${codr}`, rol);
  }

  delete(codr: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${codr}`);
  }

  asignarMenu(codr: number, codm: number): Observable<any> {
    const params = new HttpParams().set('codr', codr).set('codm', codm);
    return this.http.post<any>(`${this.resourceUrl}/asignarMenu`, null, {
      params,
    });
  }
}
