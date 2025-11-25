import { Injectable } from '@angular/core';
// ⚠️ Nota: Quitamos HttpHeaders, ya que el Interceptor lo manejará
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Asume que Menu, MenusDTO, etc., están definidos en tus archivos .model y .dto
import { Menu } from '../model/usuario.model';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class MenusService {
  // Base API URL de tu entorno (ej: http://localhost:8080)
  private api = environment.baseUrl;
  // El controlador de Backend usa: @RequestMapping("/api/menus")
  private resourceUrl = `${this.api}/api/menus`;

  constructor(private http: HttpClient) {}

  // ❌ IMPORTANTE: Eliminamos la función getAuthHeaders() y su uso.
  // La seguridad (Authorization: Bearer <token>) debe ser manejada
  // globalmente por el JwtInterceptor.

  /**
   * GET /api/menus
   * Lista todos los Menus (MenusController.ListaDeMenu())
   */
  list(): Observable<Menu[]> {
    // Ya no se requiere { headers: ... }
    return this.http.get<Menu[]>(this.resourceUrl);
  }

  /**
   * GET /api/menus/{codm} (Tu controller no tiene este método GET by ID, pero lo mantenemos por convención)
   */
  get(codm: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.resourceUrl}/${codm}`);
  }

  /**
   * POST /api/menus
   * Crea un nuevo Menu (MenusController.GuardarMenu(@RequestBody))
   */
  create(menu: Pick<Menu, 'nombre' | 'estado'>): Observable<void> {
    // El backend espera el objeto JSON en el cuerpo de la petición.
    return this.http.post<void>(this.resourceUrl, menu);
  }

  /**
   * PUT /api/menus/{codm} (Tu controller tiene este método ActulizarMenu)
   * Actualiza un Menu.
   */
  update(codm: number, menu: Pick<Menu, 'nombre' | 'estado'>): Observable<void> {
    return this.http.put<void>(`${this.resourceUrl}/${codm}`, menu);
  }

  /**
   * DELETE /api/menus/{codm}
   * Elimina un Menu por su codm (MenusController.EliminarMenu(@PathVariable))
   */
  delete(codm: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${codm}`);
  }

  // 💡 Si tienes métodos adicionales como 'asignarProceso', debes revisar
  // su firma exacta en el backend. Ejemplo:
  // asignarProceso(codm: number, codp: number): Observable<any> {
  //   const params = new HttpParams().set('codm', codm).set('codp', codp);
  //   return this.http.post<any>(`${this.resourceUrl}/asignarProceso`, null, { params });
  // }
}
