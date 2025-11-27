import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsignarRolesUsuarioDTO, UsuarioPageDto } from '../models/roles.usuarios.model';
import { Observable } from 'rxjs';
import { RolDto } from '../../roles/models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolesUsuariosService {
  private apiUrl = 'http://localhost:3030/api/usuarios'; // Ajusta tu URL base
  private api = 'http://localhost:3030/api/roles'; // Ajusta tu URL base

  constructor(private http: HttpClient) { }

  asignarRoles(dto: AsignarRolesUsuarioDTO): Observable<any> {
    return this.http.post(`${this.api}/asignar/roles`, dto);
  }

  desasignarRoles(dto: AsignarRolesUsuarioDTO): Observable<any> {
    return this.http.post(`${this.api}/desasignar/roles`, dto);
}


  // Buscar usuarios por nombre
  buscarUsuarios(nombre: string = ''): Observable<UsuarioPageDto[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<UsuarioPageDto[]>(`${this.apiUrl}/buscar`, { params });
  }

  // Obtener todos los roles
  getAllRoles(): Observable<RolDto[]> {
    return this.http.get<RolDto[]>(`${this.apiUrl}`);
  }

  // Obtener roles de un usuario específico
  getRolesForUser(login: string): Observable<RolDto[]> {
    return this.http.get<RolDto[]>(`${this.api}/usuario/${login}`);
  }

  // Obtener roles que NO están asignados a ningún usuario
  getUnassignedRoles(): Observable<RolDto[]> {
    return this.http.get<RolDto[]>(`${this.api}/sin/asignar`);
  }

  // Obtener roles asignados a cualquier usuario
  getRolesAssignedToAnyUser(): Observable<RolDto[]> {
    return this.http.get<RolDto[]>(`${this.api}/asignados`);
  }
}
