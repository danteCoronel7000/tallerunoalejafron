import { Component, inject, input, output } from '@angular/core';
import { Usuario } from '../../interfaces/usuario-ges.interface';
import { UsuariosService } from '../../services/usuarios-dash.service';
@Component({
  selector: 'table-usuarios',
  templateUrl: './table-usuarios.component.html',
})
export class TableUsuariosComponent {
  usuarios = input.required<Usuario[]>();

  listUsuarios: Usuario[] = [];

  usuarioService = inject(UsuariosService);

  constructor() {
    this.getUsuarios();
  }

  // Variables de paginacion
  currentPage: number = 0;
  pageSize: number = 3;
  totalPages: number = 0;
  totalElements: number = 0;
  isFirst: boolean = true;
  isLast: boolean = false;

  // Variables de ordenamiento
  sortBy: string = 'login';
  sortDir: string = 'asc';

  updateModal = output<Usuario>();
  deleteUsuario = output<string>();
  activeUsuario = output<string>();
  asignarAcceso = output<string>();

  changePassword = output<string>();

  getUsuarios(): void {
    this.usuarioService
      .getUsuariosPaginados(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.sortDir
      )
      .subscribe({
        next: (response) => {
          this.listUsuarios = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.isFirst = response.first;
          this.isLast = response.last;
          console.log('Página recibida:', response);
        },
        error: (err) => console.error('Error al obtener usuarios', err),
      });
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getUsuarios();
    }
  }

  cambiarPageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSize = parseInt(target.value);
      this.currentPage = 0;
      this.getUsuarios();
    }
  }
}
