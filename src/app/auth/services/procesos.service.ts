import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proceso } from '../model/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcesosService {
  private readonly api = environment.baseUrl;
  private readonly resourceUrl = `${this.api}/api/procesos`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(this.resourceUrl);
  }

  get(codp: number): Observable<Proceso> {
    return this.http.get<Proceso>(`${this.resourceUrl}/${codp}`);
  }

  create(p: Pick<Proceso, 'nombre' | 'enlace' | 'estado'>): Observable<void> {
    return this.http.post<void>(this.resourceUrl, p);
  }

  update(codp: number, p: Proceso): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${codp}`, p);
  }

  delete(codp: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${codp}`);
  }
}
