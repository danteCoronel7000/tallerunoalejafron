import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layoutmr',
  imports: [CommonModule, FormsModule],
  templateUrl: './layoutmr.html',
  styleUrl: './layoutmr.css'
})
export default class Layoutmr {
  // Datos ficticios - Roles
  listRoles: Rol[] = [
    { codr: 1, nombre: 'Administrador', estado: '1' },
    { codr: 2, nombre: 'Supervisor', estado: '1' },
    { codr: 3, nombre: 'Usuario', estado: '1' },
    { codr: 4, nombre: 'Invitado', estado: '1' },
    { codr: 5, nombre: 'Auditor', estado: '0' },
    { codr: 6, nombre: 'Desarrollador', estado: '1' },
    { codr: 7, nombre: 'Analista', estado: '1' }
  ];

  // Datos ficticios - Menús
  listMenus: Menu[] = [
    { codm: 1, nombre: 'Dashboard' },
    { codm: 2, nombre: 'Administración' },
    { codm: 3, nombre: 'Reportes' },
    { codm: 4, nombre: 'Configuración' },
    { codm: 5, nombre: 'Usuarios' },
    { codm: 6, nombre: 'Ventas' },
    { codm: 7, nombre: 'Inventario' },
    { codm: 8, nombre: 'Auditoría' }
  ];

  // Relación muchos a muchos - Datos ficticios
  menuRoles: MenuRol[] = [
    { codm: 1, codr: 1 },
    { codm: 2, codr: 1 },
    { codm: 3, codr: 1 },
    { codm: 4, codr: 1 },
    { codm: 1, codr: 2 }
  ];

  // Filtros
  filtroRol = '';
  filtroMenu = '';
  filtroAsignacion = 'todos'; // 'asignados', 'todos', 'noAsignados'

  // Selección - Roles (Radio Button - Solo uno)
  rolSeleccionado: number | null = null;

  // Selección - Menús (Checkboxes - Múltiples)
  menusSeleccionados = new Set<number>();
  todosMenusMarcados = false;

  // Paginación Roles
  currentPageRoles = 0;
  pageSizeRoles = 3;
  totalElementsRoles = 0;
  isFirstRoles = true;
  isLastRoles = false;
  rolesPaginados: Rol[] = [];

  // Paginación Menús
  currentPageMenus = 0;
  pageSizeMenus = 3;
  totalElementsMenus = 0;
  isFirstMenus = true;
  isLastMenus = false;
  menusPaginados: Menu[] = [];

  ngOnInit(): void {
    this.actualizarPaginacionRoles();
    this.actualizarPaginacionMenus();
  }

  // ==================== MÉTODOS ROLES ====================

  seleccionarRol(codr: number): void {
    this.rolSeleccionado = codr;
    this.menusSeleccionados.clear();
    this.todosMenusMarcados = false;
    this.actualizarPaginacionMenus();
  }

  actualizarPaginacionRoles(): void {
    const rolesFiltrados = this.listRoles.filter(rol =>
      rol.nombre.toLowerCase().includes(this.filtroRol.toLowerCase())
    );

    this.totalElementsRoles = rolesFiltrados.length;
    const inicio = this.currentPageRoles * this.pageSizeRoles;
    const fin = inicio + this.pageSizeRoles;
    this.rolesPaginados = rolesFiltrados.slice(inicio, fin);

    this.isFirstRoles = this.currentPageRoles === 0;
    this.isLastRoles = fin >= this.totalElementsRoles;
  }

  cambiarPaginaRoles(page: number): void {
    this.currentPageRoles = page;
    this.actualizarPaginacionRoles();
  }

  cambiarPageSizeRoles(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeRoles = parseInt(select.value);
    this.currentPageRoles = 0;
    this.actualizarPaginacionRoles();
  }

  // ==================== MÉTODOS MENÚS ====================

  toggleSeleccionMenu(codm: number): void {
    if (this.menusSeleccionados.has(codm)) {
      this.menusSeleccionados.delete(codm);
    } else {
      this.menusSeleccionados.add(codm);
    }
    this.actualizarTodosMenusMarcados();
  }

  toggleTodosMenus(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.menusPaginados.forEach(menu => this.menusSeleccionados.add(menu.codm));
    } else {
      this.menusPaginados.forEach(menu => this.menusSeleccionados.delete(menu.codm));
    }
    this.actualizarTodosMenusMarcados();
  }

  actualizarTodosMenusMarcados(): void {
    this.todosMenusMarcados = this.menusPaginados.length > 0 &&
      this.menusPaginados.every(menu => this.menusSeleccionados.has(menu.codm));
  }

  actualizarPaginacionMenus(): void {
    let menusFiltrados = this.listMenus.filter(menu =>
      menu.nombre.toLowerCase().includes(this.filtroMenu.toLowerCase())
    );

    // Aplicar filtro de asignación
    if (this.rolSeleccionado) {
      if (this.filtroAsignacion === 'asignados') {
        menusFiltrados = menusFiltrados.filter(menu =>
          this.esMenuAsignado(menu.codm)
        );
      } else if (this.filtroAsignacion === 'noAsignados') {
        menusFiltrados = menusFiltrados.filter(menu =>
          !this.esMenuAsignado(menu.codm)
        );
      }
    }

    this.totalElementsMenus = menusFiltrados.length;
    const inicio = this.currentPageMenus * this.pageSizeMenus;
    const fin = inicio + this.pageSizeMenus;
    this.menusPaginados = menusFiltrados.slice(inicio, fin);

    this.isFirstMenus = this.currentPageMenus === 0;
    this.isLastMenus = fin >= this.totalElementsMenus;

    this.actualizarTodosMenusMarcados();
  }

  cambiarPaginaMenus(page: number): void {
    this.currentPageMenus = page;
    this.actualizarPaginacionMenus();
  }

  cambiarPageSizeMenus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeMenus = parseInt(select.value);
    this.currentPageMenus = 0;
    this.actualizarPaginacionMenus();
  }

  esMenuAsignado(codm: number): boolean {
    if (!this.rolSeleccionado) return false;
    return this.menuRoles.some(mr => mr.codr === this.rolSeleccionado && mr.codm === codm);
  }

  // ==================== MÉTODOS DE ASIGNACIÓN ====================

  asignarMenusARol(): void {
    if (!this.rolSeleccionado || this.menusSeleccionados.size === 0) {
      console.log('Debe seleccionar un rol y al menos un menú');
      return;
    }

    this.menusSeleccionados.forEach(codm => {
      // Verificar si ya existe la asignación
      const existe = this.menuRoles.some(mr => mr.codr === this.rolSeleccionado && mr.codm === codm);
      if (!existe) {
        this.menuRoles.push({
          codr: this.rolSeleccionado!,
          codm: codm
        });
      }
    });

    console.log('Menús asignados correctamente');
    console.log('Relaciones actuales:', this.menuRoles);
    
    this.menusSeleccionados.clear();
    this.todosMenusMarcados = false;
    this.actualizarPaginacionMenus();
  }

  desasignarMenus(): void {
    if (!this.rolSeleccionado || this.menusSeleccionados.size === 0) {
      console.log('Debe seleccionar un rol y al menos un menú');
      return;
    }

    this.menusSeleccionados.forEach(codm => {
      const index = this.menuRoles.findIndex(mr => mr.codr === this.rolSeleccionado && mr.codm === codm);
      if (index !== -1) {
        this.menuRoles.splice(index, 1);
      }
    });

    console.log('Menús desasignados correctamente');
    console.log('Relaciones actuales:', this.menuRoles);
    
    this.menusSeleccionados.clear();
    this.todosMenusMarcados = false;
    this.actualizarPaginacionMenus();
  }
}
