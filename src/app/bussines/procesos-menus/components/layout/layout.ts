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
    // Datos ficticios - Menús
  listMenus: Menu[] = [
    { codm: 1, nombre: 'Dashboard' },
    { codm: 2, nombre: 'Administración' },
    { codm: 3, nombre: 'Reportes' },
    { codm: 4, nombre: 'Configuración' },
    { codm: 5, nombre: 'Usuarios' },
    { codm: 6, nombre: 'Ventas' },
    { codm: 7, nombre: 'Inventario' }
  ];

  // Datos ficticios - Procesos
  listProcesos: Proceso[] = [
    { codp: 1, nombre: 'Gestión de Usuarios', enlace: '/admin/usuarios', ayuda: 'Administrar usuarios del sistema', estado: 1 },
    { codp: 2, nombre: 'Gestión de Roles', enlace: '/admin/roles', ayuda: 'Administrar roles y permisos', estado: 1 },
    { codp: 3, nombre: 'Ver Dashboard', enlace: '/dashboard', ayuda: 'Panel de control principal', estado: 1 },
    { codp: 4, nombre: 'Reportes Ventas', enlace: '/reportes/ventas', ayuda: 'Generar reportes de ventas', estado: 1 },
    { codp: 5, nombre: 'Configuración Sistema', enlace: '/config/sistema', ayuda: 'Configurar parámetros del sistema', estado: 1 },
    { codp: 6, nombre: 'Backup DB', enlace: '/config/backup', ayuda: 'Realizar respaldo de base de datos', estado: 0 },
    { codp: 7, nombre: 'Auditoría', enlace: '/admin/auditoria', ayuda: 'Ver logs de auditoría', estado: 1 },
    { codp: 8, nombre: 'Control Inventario', enlace: '/inventario/control', ayuda: 'Gestionar inventario', estado: 1 }
  ];

  // Relación muchos a muchos - Datos ficticios
  menuProcesos: MenuProceso[] = [
    { codm: 1, codp: 3 },
    { codm: 2, codp: 1 },
    { codm: 2, codp: 2 },
    { codm: 4, codp: 5 },
    { codm: 4, codp: 6 }
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
          this.esProcesoAsignado(proceso.codp)
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
