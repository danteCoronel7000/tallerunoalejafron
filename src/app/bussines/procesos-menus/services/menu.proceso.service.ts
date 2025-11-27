import { Injectable } from '@angular/core';
import { AsignarProcesosMenuDTO, ProcesoDto } from '../models/pro-menu.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuProcesoService {
  private apiUrl = 'http://localhost:3030/api/menus'; // ahora menus = antes roles
private api = 'http://localhost:3030/api/procesos'; // ahora procesos = antes menus

constructor(private http: HttpClient) { }

// === asignar procesos a un menú ===
asignarProcesos(dto: AsignarProcesosMenuDTO): Observable<any> {
  return this.http.post(`${this.api}/asignar/procesos`, dto);
}

desasignarProcesos(dto: AsignarProcesosMenuDTO): Observable<any> {
  return this.http.post(`${this.api}/desasignar/procesos`, dto);
}

// === Buscar menús (antes roles) por nombre ===
buscarMenus(nombre: string = ''): Observable<MenuDto[]> {
  let params = new HttpParams();

  if (nombre && nombre.trim() !== '') {
    params = params.set('nombre', nombre.trim());
  }

  return this.http.get<MenuDto[]>(`${this.apiUrl}/buscar`, { params });
}

// === Obtener todos los procesos (antes menús) ===
getAllProcesos(): Observable<ProcesoDto[]> {
  return this.http.get<ProcesoDto[]>(`${this.api}`);
}

// === Obtener procesos asignados a un menú específico (antes: menús de un rol) ===
getProcesosForMenu(codm: number): Observable<ProcesoDto[]> {
  return this.http.get<ProcesoDto[]>(`${this.api}/menu/${codm}`);
}

// === Obtener procesos NO asignados a ningún menú ===
getUnassignedProcesos(): Observable<ProcesoDto[]> {
  return this.http.get<ProcesoDto[]>(`${this.api}/sin/asignar`);
}

// === Obtener procesos asignados a cualquier menú ===
getProcesosAssignedToAnyMenu(): Observable<ProcesoDto[]> {
  return this.http.get<ProcesoDto[]>(`${this.api}/asignados`);
}

}
