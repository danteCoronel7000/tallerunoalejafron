import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personal } from '../model/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonalService {
  private readonly api = environment.baseUrl;
  private readonly resourceUrl = `${this.api}/api/personal`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Personal[]> {
    return this.http.get<Personal[]>(this.resourceUrl);
  }
  get(codp: number): Observable<Personal> {
    return this.http.get<Personal>(`${this.resourceUrl}/${codp}`);
  }

  create(p: Personal): Observable<void> {
    return this.http.post<void>(this.resourceUrl, p);
  }

  update(codp: number, p: Personal): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${codp}`, p);
  }

  delete(codp: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${codp}`);
  }
}
