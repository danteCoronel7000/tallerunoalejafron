import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolDto } from '../../roles/models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class MenuRolService {
  private apiUrl = 'http://localhost:3030/api/roles'; // Ajusta tu URL base
private api = 'http://localhost:3030/api/menus'; // Ajusta tu URL base

constructor(private http: HttpClient) { }

asignarMenus(dto: AsignarMenusRolDTO): Observable<any> {
  return this.http.post(`${this.api}/asignar/menus`, dto);
}

desasignarMenus(dto: AsignarMenusRolDTO): Observable<any> {
  return this.http.post(`${this.api}/desasignar/menus`, dto);
}

// Buscar roles por nombre
buscarRoles(nombre: string = ''): Observable<RolDto[]> {
  let params = new HttpParams();
  if (nombre && nombre.trim() !== '') {
    params = params.set('nombre', nombre.trim());
  }
  return this.http.get<RolDto[]>(`${this.apiUrl}/buscar`, { params });
}

// Obtener todos los menús
getAllMenus(): Observable<MenuDto[]> {
  return this.http.get<MenuDto[]>(`${this.api}`);
}

// Obtener menús de un rol específico
getMenusForRol(codr: number): Observable<MenuDto[]> {
  return this.http.get<MenuDto[]>(`${this.api}/rol/${codr}`);
}

// Obtener menús que NO están asignados a ningún rol
getUnassignedMenus(): Observable<MenuDto[]> {
  return this.http.get<MenuDto[]>(`${this.api}/sin/asignar`);
}

// Obtener menús asignados a cualquier rol
getMenusAssignedToAnyRol(): Observable<MenuDto[]> {
  return this.http.get<MenuDto[]>(`${this.api}/asignados`);
}
}
