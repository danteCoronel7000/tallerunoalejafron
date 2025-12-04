import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateMateriaRequest, CreateMateriaResponse, MateriaDto, UpdateMateriaRequest } from '../models/materia.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageableResponse } from '../../../dashboard/interfaces/usuario-ges.interface';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  private apiUrl = 'http://localhost:3030/api/materias'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) { }

  createMateria(materiaData: CreateMateriaRequest): Observable<CreateMateriaResponse> {
    return this.http.post<CreateMateriaResponse>(`${this.apiUrl}/create`, materiaData);
  }

  // Método opcional para validar si la materia existe
  checkMateriaExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?name=${name}`);
  }

  getMateriasPaginadas(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<MateriaDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<MateriaDto>>(`${this.apiUrl}/get/paginado/materias`, { params });
  }

  getMateriasPaginadasDto(
    page: number = 0,
    size: number = 3,
    sortBy: string = 'nombre',
    sortDir: string = 'asc'
  ): Observable<PageableResponse<MateriaDto>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PageableResponse<MateriaDto>>(`${this.apiUrl}/get/paginado/materias`, { params });
  }

  updateMateria(id: number, materiaData: UpdateMateriaRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, materiaData);
  }

  // Habilitar materia - ahora retorna string
  habilitarMateria(codm: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codm}/habilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Deshabilitar materia - ahora retorna string
  deshabilitarMateria(codm: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${codm}/deshabilitar`, {}, { 
      responseType: 'text' 
    });
  }

  // Buscar materias por nombre
  buscarMaterias(nombre: string = ''): Observable<MateriaDto[]> {
    let params = new HttpParams();
    if (nombre && nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }
    return this.http.get<MateriaDto[]>(`${this.apiUrl}/buscar`, { params });
  }

  getMateriasPorEstado(estado: string): Observable<MateriaDto[]> {
    return this.http.get<MateriaDto[]>(`${this.apiUrl}/estado/${estado}`);
  }

  
}