import { Injectable } from '@angular/core';
import { PageableResponse } from '../../../dashboard/interfaces/usuario-ges.interface';
import { ProcesoDto } from '../models/pro-menu.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private apiUrl = 'http://localhost:3030/api/procesos'; // ahora procesos (antes menus)

  constructor(private http: HttpClient) { }
// Obtener procesos paginados
getProcesosPaginados(
  page: number = 0,
  size: number = 3,
  sortBy: string = 'nombre',
  sortDir: string = 'asc'
): Observable<PageableResponse<ProcesoDto>> {

  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sortBy', sortBy)
    .set('sortDir', sortDir);

  return this.http.get<PageableResponse<ProcesoDto>>(
    `${this.apiUrl}/get/paginado/procesos`,
    { params }
  );
}

// Buscar procesos por nombre
buscarProcesos(nombre: string = ''): Observable<ProcesoDto[]> {
  let params = new HttpParams();

  if (nombre && nombre.trim() !== '') {
    params = params.set('nombre', nombre.trim());
  }

  return this.http.get<ProcesoDto[]>(`${this.apiUrl}/buscar`, { params });
}

}
