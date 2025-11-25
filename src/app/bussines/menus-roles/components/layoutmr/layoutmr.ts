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
  listMenus: Menu[] = [
  { codm: 1, nombre: "Dashboard" },
  { codm: 2, nombre: "Usuarios" },
  { codm: 3, nombre: "Roles" },
  { codm: 4, nombre: "Menús" },
  { codm: 5, nombre: "Reportes" },
  { codm: 6, nombre: "Configuración" },
  { codm: 7, nombre: "Auditoría" },
  { codm: 8, nombre: "Perfil" }
];

 listRoles: Rol[] = [
  { codr: 1, nombre: "Administrador", estado: "1" },
  { codr: 2, nombre: "Supervisor", estado: '1' },
  { codr: 3, nombre: "Usuario", estado: '1' },
  { codr: 4, nombre: "Invitado", estado: '1' },
  { codr: 5, nombre: "Auditor", estado: '0' },
  { codr: 6, nombre: "Desarrollador", estado: '1' },
  { codr: 7, nombre: "Analista", estado: '1' },
  { codr: 8, nombre: "Consultor", estado: '0' }
];

 menuRoles: MenuRol[] = [
  { codm: 1, codr: 1 }, // Dashboard - Administrador
  { codm: 2, codr: 1 }, // Usuarios - Administrador
  { codm: 3, codr: 1 }, // Roles - Administrador
  { codm: 4, codr: 1 }, // Menús - Administrador
  { codm: 1, codr: 2 }, // Dashboard - Supervisor
  { codm: 5, codr: 2 }, // Reportes - Supervisor
  { codm: 1, codr: 3 }, // Dashboard - Usuario
  { codm: 8, codr: 3 }  // Perfil - Usuario
];
  // Filtros
  filtroMenu = '';
  filtroProceso = '';
  filtroAsignacion = 'todos'; // 'asignados', 'todos', 'noAsignados'

  // Selección - Menús (Radio Button - Solo uno)
  menuSeleccionado: number | null = null;

  // Selección - Procesos (Checkboxes - Múltiples)
  procesosSeleccionados = new Set<number>();
  todosProcesosMarcados = false;

  // Paginación Menús
  currentPageMenus = 0;
  pageSizeMenus = 3;
  totalElementsMenus = 0;
  isFirstMenus = true;
  isLastMenus = false;
  menusPaginados: Menu[] = [];

  // Paginación Procesos
  currentPageProcesos = 0;
  pageSizeProcesos = 3;
  totalElementsProcesos = 0;
  isFirstProcesos = true;
  isLastProcesos = false;
  procesosPaginados: Proceso[] = [];

  ngOnInit(): void {
    this.actualizarPaginacionMenus();
    this.actualizarPaginacionProcesos();
  }

  // ==================== MÉTODOS MENÚS ====================

  seleccionarMenu(codm: number): void {
    this.menuSeleccionado = codm;
    this.procesosSeleccionados.clear();
    this.todosProcesosMarcados = false;
    this.actualizarPaginacionProcesos();
  }

  actualizarPaginacionMenus(): void {
    const menusFiltrados = this.listMenus.filter(menu =>
      menu.nombre.toLowerCase().includes(this.filtroMenu.toLowerCase())
    );

    this.totalElementsMenus = menusFiltrados.length;
    const inicio = this.currentPageMenus * this.pageSizeMenus;
    const fin = inicio + this.pageSizeMenus;
    this.menusPaginados = menusFiltrados.slice(inicio, fin);

    this.isFirstMenus = this.currentPageMenus === 0;
    this.isLastMenus = fin >= this.totalElementsMenus;
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

  // ==================== MÉTODOS PROCESOS ====================

  toggleSeleccionProceso(codp: number): void {
    if (this.procesosSeleccionados.has(codp)) {
      this.procesosSeleccionados.delete(codp);
    } else {
      this.procesosSeleccionados.add(codp);
    }
    this.actualizarTodosProcesosMarcados();
  }

  toggleTodosProcesos(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.procesosPaginados.forEach(proceso => this.procesosSeleccionados.add(proceso.codp));
    } else {
      this.procesosPaginados.forEach(proceso => this.procesosSeleccionados.delete(proceso.codp));
    }
    this.actualizarTodosProcesosMarcados();
  }

  actualizarTodosProcesosMarcados(): void {
    this.todosProcesosMarcados = this.procesosPaginados.length > 0 &&
      this.procesosPaginados.every(proceso => this.procesosSeleccionados.has(proceso.codp));
  }

  actualizarPaginacionProcesos(): void {
    let procesosFiltrados = this.listProcesos.filter(proceso =>
      proceso.nombre.toLowerCase().includes(this.filtroProceso.toLowerCase())
    );

    // Aplicar filtro de asignación
    if (this.menuSeleccionado) {
      if (this.filtroAsignacion === 'asignados') {
        procesosFiltrados = procesosFiltrados.filter(proceso =>
          this.gnado(proceso.codp)
        );
      } else if (this.filtroAsignacion === 'noAsignados') {
        procesosFiltrados = procesosFiltrados.filter(proceso =>
          !this.esProcesoAsignado(proceso.codp)
        );
      }
    }

    this.totalElementsProcesos = procesosFiltrados.length;
    const inicio = this.currentPageProcesos * this.pageSizeProcesos;
    const fin = inicio + this.pageSizeProcesos;
    this.procesosPaginados = procesosFiltrados.slice(inicio, fin);

    this.isFirstProcesos = this.currentPageProcesos === 0;
    this.isLastProcesos = fin >= this.totalElementsProcesos;

    this.actualizarTodosProcesosMarcados();
  }

  cambiarPaginaProcesos(page: number): void {
    this.currentPageProcesos = page;
    this.actualizarPaginacionProcesos();
  }

  cambiarPageSizeProcesos(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeProcesos = parseInt(select.value);
    this.currentPageProcesos = 0;
    this.actualizarPaginacionProcesos();
  }

  esProcesoAsignado(codp: number): boolean {
    if (!this.menuSeleccionado) return false;
    return this.menuProcesos.some(mp => mp.codm === this.menuSeleccionado && mp.codp === codp);
  }

  // ==================== MÉTODOS DE ASIGNACIÓN ====================

  asignarProcesosAMenu(): void {
    if (!this.menuSeleccionado || this.procesosSeleccionados.size === 0) {
      console.log('Debe seleccionar un menú y al menos un proceso');
      return;
    }

    this.procesosSeleccionados.forEach(codp => {
      // Verificar si ya existe la asignación
      const existe = this.menuProcesos.some(mp => mp.codm === this.menuSeleccionado && mp.codp === codp);
      if (!existe) {
        this.menuProcesos.push({
          codm: this.menuSeleccionado!,
          codp: codp
        });
      }
    });

    console.log('Procesos asignados correctamente');
    console.log('Relaciones actuales:', this.menuProcesos);
    
    this.procesosSeleccionados.clear();
    this.todosProcesosMarcados = false;
    this.actualizarPaginacionProcesos();
  }

  desasignarProcesos(): void {
    if (!this.menuSeleccionado || this.procesosSeleccionados.size === 0) {
      console.log('Debe seleccionar un menú y al menos un proceso');
      return;
    }

    this.procesosSeleccionados.forEach(codp => {
      const index = this.menuProcesos.findIndex(mp => mp.codm === this.menuSeleccionado && mp.codp === codp);
      if (index !== -1) {
        this.menuProcesos.splice(index, 1);
      }
    });

    console.log('Procesos desasignados correctamente');
    console.log('Relaciones actuales:', this.menuProcesos);
    
    this.procesosSeleccionados.clear();
    this.todosProcesosMarcados = false;
    this.actualizarPaginacionProcesos();
  }
}
