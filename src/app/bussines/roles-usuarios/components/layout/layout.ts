import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {
   // Datos ficticios - Usuarios
  listUsuarios: Usuario[] = [
    { login: 'jperez', estado: 'Activo', password: '****', codp: 1, selected: false },
    { login: 'mgarcia', estado: 'Activo', password: '****', codp: 2, selected: false },
    { login: 'alopez', estado: 'Inactivo', password: '****', codp: 3, selected: false },
    { login: 'cmartinez', estado: 'Activo', password: '****', codp: 4, selected: false },
    { login: 'lrodriguez', estado: 'Activo', password: '****', codp: 5, selected: false }
  ];

  // Datos ficticios - Roles
  listRoles: Rol[] = [
    { codr: 1, nombre: 'Administrador', estado: 'Activo', selected: false },
    { codr: 2, nombre: 'Usuario', estado: 'Activo', selected: false },
    { codr: 3, nombre: 'Supervisor', estado: 'Activo', selected: false },
    { codr: 4, nombre: 'Analista', estado: 'Inactivo', selected: false },
    { codr: 5, nombre: 'Operador', estado: 'Activo', selected: false }
  ];

  // Paginación Usuarios
  currentPageUsuarios = 0;
  pageSizeUsuarios = 3;
  totalElementsUsuarios = 5;
  isFirstUsuarios = true;
  isLastUsuarios = false;

  // Paginación Roles
  currentPageRoles = 0;
  pageSizeRoles = 3;
  totalElementsRoles = 5;
  isFirstRoles = true;
  isLastRoles = false;

  // Filtros
  filtroUsuario = '';
  filtroRol = '';
  filtroAsignacion = 'todos'; // 'asignados', 'todos', 'no-asignados'

  // Selección
  selectAllUsuarios = false;
  selectAllRoles = false;

  cambiarPaginaUsuarios(page: number): void {
    this.currentPageUsuarios = page;
    this.isFirstUsuarios = page === 0;
    // Lógica de paginación aquí
  }

  cambiarPageSizeUsuarios(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeUsuarios = parseInt(select.value);
    this.currentPageUsuarios = 0;
    // Lógica de cambio de tamaño aquí
  }

  cambiarPaginaRoles(page: number): void {
    this.currentPageRoles = page;
    this.isFirstRoles = page === 0;
    // Lógica de paginación aquí
  }

  cambiarPageSizeRoles(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeRoles = parseInt(select.value);
    this.currentPageRoles = 0;
    // Lógica de cambio de tamaño aquí
  }

  filtrarUsuarios(): void {
    // Lógica de filtrado de usuarios
  }

  filtrarRoles(): void {
    // Lógica de filtrado de roles
  }

  toggleSelectAllUsuarios(): void {
    this.listUsuarios.forEach(usuario => usuario.selected = this.selectAllUsuarios);
  }

  toggleSelectAllRoles(): void {
    this.listRoles.forEach(rol => rol.selected = this.selectAllRoles);
  }

  onUsuarioSelect(): void {
    this.selectAllUsuarios = this.listUsuarios.every(u => u.selected);
  }

  onRolSelect(): void {
    this.selectAllRoles = this.listRoles.every(r => r.selected);
  }

  cambiarFiltroAsignacion(tipo: string): void {
    this.filtroAsignacion = tipo;
    // Lógica de filtrado por asignación
  }
}
