import { inject, Injectable } from '@angular/core';
import { CreateRoleRequest, CreateRoleResponse, RolDto, UpdateRoleRequest } from '../models/rol.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageableResponse } from '../../../dashboard/interfaces/usuario-ges.interface';
import { UsuarioPageDto } from '../../roles-usuarios/models/roles.usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = 'http://localhost:3030/api/roles'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) { }


  createRole(roleData: CreateRoleRequest): Observable<CreateRoleResponse> {
    return this.http.post<CreateRoleResponse>(`${this.apiUrl}/create`, roleData);
  }

  // Método opcional para validar si el rol existe
  checkRoleExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?name=${name}`);
  }


  getRolesPaginados(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<RolDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<RolDto>>(`${this.apiUrl}/get/paginado/roles`, { params });
  }

  getRolesPaginadosDto(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<RolDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<RolDto>>(`${this.apiUrl}/get/paginado/roles`, { params });
  }


  updateRole(id: number, roleData: UpdateRoleRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, roleData);
  }

     // Habilitar rol - ahora retorna string
  habilitarRol(codr: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codr}/habilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Deshabilitar rol - ahora retorna string
  deshabilitarRol(codr: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codr}/deshabilitar`, {}, { 
      responseType: 'text' 
    });
  }

   // Buscar roles por nombre
  buscarRoles(nombre: string = ''): Observable<RolDto[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<RolDto[]>(`${this.apiUrl}/buscar`, { params });
  }

  getRolesPorEstado(estado: string): Observable<RolDto[]> {
  return this.http.get<RolDto[]>(`${this.apiUrl}/estado/${estado}`);
}

// Buscar usuarios por nombre
buscarUsuarios(nombre: string = ''): Observable<UsuarioPageDto[]> {
  let params = new HttpParams();
  if (nombre && nombre.trim() !== '') {
    params = params.set('nombre', nombre.trim());
  }
  return this.http.get<UsuarioPageDto[]>(`${this.apiUrl}/buscar`, { params });
}

}




