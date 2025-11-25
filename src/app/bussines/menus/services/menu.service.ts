import { Injectable } from '@angular/core';
import { CreateMenuRequest, CreateMenuResponse, MenuDto, UpdateMenuRequest } from '../models/menu.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageableResponse } from '../../../dashboard/interfaces/usuario-ges.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:3030/api/menus'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) { }

  createMenu(menuData: CreateMenuRequest): Observable<CreateMenuResponse> {
    return this.http.post<CreateMenuResponse>(`${this.apiUrl}/create`, menuData);
  }

  // Método opcional para validar si el menu existe
  checkMenuExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?name=${name}`);
  }

  getMenusPaginados(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<MenuDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<MenuDto>>(`${this.apiUrl}/get/paginado/menus`, { params });
  }

  updateMenu(id: number, menuData: UpdateMenuRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, menuData);
  }

  // Habilitar menu - ahora retorna string
  habilitarMenu(codm: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codm}/habilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Deshabilitar menu - ahora retorna string
  deshabilitarMenu(codm: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codm}/deshabilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Buscar menus por nombre
  buscarMenus(nombre: string = ''): Observable<MenuDto[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<MenuDto[]>(`${this.apiUrl}/buscar`, { params });
  }

  getMenusPorEstado(estado: string): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${this.apiUrl}/estado/${estado}`);
  }
}