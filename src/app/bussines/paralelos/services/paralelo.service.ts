import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateParaleloRequest, CreateParaleloResponse, ParaleloDto, UpdateParaleloRequest } from '../models/paralelo.model';
import { Observable } from 'rxjs';
import { PageableResponse } from '../../../dashboard/interfaces/usuario-ges.interface';

@Injectable({
  providedIn: 'root'
})
export class ParaleloService {

  private apiUrl = 'http://localhost:3030/api/paralelos'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) { }

  createParalelo(paraleloData: CreateParaleloRequest): Observable<CreateParaleloResponse> {
    return this.http.post<CreateParaleloResponse>(`${this.apiUrl}/create`, paraleloData);
  }

  // Método opcional para validar si el paralelo existe
  checkParaleloExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?name=${name}`);
  }

  getParalelosPaginados(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<ParaleloDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<ParaleloDto>>(`${this.apiUrl}/get/paginado/paralelos`, { params });
  }

  getParalelosPaginadosDto(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<ParaleloDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<ParaleloDto>>(`${this.apiUrl}/get/paginado/paralelos`, { params });
  }

  updateParalelo(id: number, paraleloData: UpdateParaleloRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, paraleloData);
  }

  // Habilitar paralelo - ahora retorna string
  habilitarParalelo(codm: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codm}/habilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Deshabilitar paralelo - ahora retorna string
  deshabilitarParalelo(codm: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codm}/deshabilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Buscar paralelos por nombre
  buscarParalelos(nombre: string = ''): Observable<ParaleloDto[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<ParaleloDto[]>(`${this.apiUrl}/buscar`, { params });
  }

  getParalelosPorEstado(estado: string): Observable<ParaleloDto[]> {
    return this.http.get<ParaleloDto[]>(`${this.apiUrl}/estado/${estado}`);
  }
}