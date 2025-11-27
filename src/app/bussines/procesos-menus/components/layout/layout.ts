import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsignarProcesosMenuDTO, MenuDto, ProcesoDto } from '../../models/pro-menu.model';
import { MenuProcesoService } from '../../services/menu.proceso.service';
import { MenuService } from '../../../menus/services/menu.service';
import { ProcesoService } from '../../services/proceso.service';
import Swal from 'sweetalert2';

type EstadoFiltro = 'todos' | 'asignados' | 'noasignados' | 'menu';
@Component({
  selector: 'app-layout',
  imports: [CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {
    
  // listas
  listMenus: MenuDto[] = [];
  listProcesos: ProcesoDto[] = [];

  estadoSeleccionado: EstadoFiltro = 'todos';
  errorMessage = '';
  procesosDelMenu = new Set<number>(); 
  procesosMenuSeleccionado: number[] = []; 

  // selecciones y relaciones
  menuSeleccionado: number | null = null;
  procesosSeleccionados: Set<number> = new Set<number>();

  // paginación menús
  currentPageMenus = 0;
  pageSizeMenus = 3;
  totalPagesMenus = 0;
  totalElementsMenus = 0;
  isFirstMenus = true;
  isLastMenus = false;
  menuSortBy: string = 'codm';
  menuSortDir: string = 'asc';

  // paginación procesos
  currentPageProcesos = 0;
  pageSizeProcesos = 3;
  totalPagesProcesos = 0;
  totalElementsProcesos = 0;
  isFirstProcesos = true;
  isLastProcesos = false;
  procesoSortBy: string = 'codp';
  procesoSortDir: string = 'asc';

  // servicios
  menuProcesoService = inject(MenuProcesoService);
  menuService = inject(MenuService);
  procesoService = inject(ProcesoService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.getMenus();
    this.getProcesos();
  }

  // === llamadas al backend ===
  getMenus(): void {
    this.menuService.getMenusPaginadosDto(
      this.currentPageMenus,
      this.pageSizeMenus,
      this.menuSortBy,
      this.menuSortDir
    ).subscribe({
      next: (response) => {
        this.listMenus = response.content;
        this.totalPagesMenus = response.totalPages;
        this.totalElementsMenus = response.totalElements;
        this.isFirstMenus = response.first;
        this.isLastMenus = response.last;
        this.cdr.detectChanges();
        console.log('Página recibida de menus:', response);
      },
      error: (err) => console.error('Error al obtener menus', err),
    });
  }

  getProcesos(): void {
    this.procesoService.getProcesosPaginados(
      this.currentPageProcesos,
      this.pageSizeProcesos,
      this.procesoSortBy,
      this.procesoSortDir
    ).subscribe({
      next: (response) => {
        this.listProcesos = response.content || [];
        this.totalPagesProcesos = response.totalPages ?? 0;
        this.totalElementsProcesos = response.totalElements ?? 0;
        this.isFirstProcesos = response.first ?? (this.currentPageProcesos === 0);
        this.isLastProcesos = response.last ?? (this.currentPageProcesos >= (this.totalPagesProcesos - 1));
        this.cdr.detectChanges();
        console.log('Página recibida de procesos:', response);
      },
      error: (err) => console.error('Error al obtener procesos', err),
    });
  }

  // === trackBy para ngFor ===
  trackByCodm(index: number, item: MenuDto) {
    return item.codm;
  }

  // === selección menú ===
  seleccionarMenu(codm: number): void {
    this.menuSeleccionado = codm;

    setTimeout(() => {
      this.estadoSeleccionado = 'menu';
      this.filtrarByEstado('menu');
    }, 100);
  }

  // === toggle procesos seleccionados ===
  toggleSeleccionProceso(codp: number): void {
    if (this.procesosSeleccionados.has(codp)) {
      this.procesosSeleccionados.delete(codp);
    } else {
      this.procesosSeleccionados.add(codp);
    }
    this.cdr.detectChanges();
  }

  // paginación menús
  cambiarPaginaMenus(page: number): void {
    if (page >= 0 && page < this.totalPagesMenus) {
      this.currentPageMenus = page;
      this.getMenus();
    }
  }

  cambiarPageSizeMenus(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSizeMenus = parseInt(target.value, 10);
    this.currentPageMenus = 0;
    this.getMenus();
  }

  // paginación procesos
  cambiarPaginaProcesos(page: number): void {
    if (page >= 0 && page < this.totalPagesProcesos) {
      this.currentPageProcesos = page;
      this.getProcesos();
    }
  }

  cambiarPageSizeProcesos(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSizeProcesos = parseInt(target.value, 10);
    this.currentPageProcesos = 0;
    this.getProcesos();
  }

  asignarProcesosAMenu() {
    if (!this.menuSeleccionado || this.procesosSeleccionados.size === 0) {
      console.log('Debe seleccionar un menú y al menos un proceso');
      return;
    }

    const dto: AsignarProcesosMenuDTO = {
      menuId: this.menuSeleccionado,
      procesosIds: Array.from(this.procesosSeleccionados)
    };

    this.menuProcesoService.asignarProcesos(dto).subscribe({
      next: () => {
        Swal.fire(
          '¡Éxito!',
          'Procesos asignados correctamente.',
          'success'
        );
      },
      error: (err) => {
        console.error("Error asignando procesos:", err);
        Swal.fire('Error', 'Fallo al asignar procesos al menú.', 'error');
      }
    });
  }

  limpiarSeleccion() {
    this.menuSeleccionado = null;
    this.procesosSeleccionados.clear();
  }

  desasignarProcesosAMenu() {
    if (!this.menuSeleccionado || this.procesosSeleccionados.size === 0) {
      console.log('Debe seleccionar un menú y al menos un proceso');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a desasignar los procesos seleccionados del menú",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        const dto: AsignarProcesosMenuDTO = {
          menuId: this.menuSeleccionado!,
          procesosIds: Array.from(this.procesosSeleccionados)
        };

        this.menuProcesoService.desasignarProcesos(dto).subscribe({
          next: () => {
            Swal.fire(
              '¡Éxito!',
              'Procesos desasignados correctamente.',
              'success'
            );
            this.limpiarSeleccion();
          },
          error: (err) => {
            console.error("Error desasignando procesos:", err);
            Swal.fire('Error', 'Fallo al desasignar procesos del menú.', 'error');
          }
        });
      }
    });
  }

  onEnterFiltroProceso(valor: string) {
    this.procesoService.buscarProcesos(valor).subscribe({
      next: (procesos) => {
        this.listProcesos = procesos;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al buscar procesos:', error);
      }
    });
  }

  onEnterFiltroMenu(valor: string) {
    this.menuService.buscarMenus(valor).subscribe({
      next: (menus) => {
        this.listMenus = menus;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al buscar menus:', error);
      }
    });
  }

  filtrarByEstado(estado: EstadoFiltro): void {
    this.estadoSeleccionado = estado;
    this.errorMessage = '';

    switch (estado) {
      case 'todos':
        this.getProcesos();
        break;

      case 'asignados':
        this.getProcesosAsignados();
        break;

      case 'noasignados':
        this.getProcesosNoAsignados();
        break;

      case 'menu':
        if (this.menuSeleccionado) {
          this.getProcesosByMenu(this.menuSeleccionado);
        } else {
          this.errorMessage = 'Por favor, seleccione un menú primero';
        }
        break;

      default:
        this.getProcesos();
    }
  }

  isProcesoMarcado(codp: number): boolean {
    return this.procesosMenuSeleccionado.includes(codp);
  }

  private getProcesosAsignados(): void {
    this.menuProcesoService.getProcesosAssignedToAnyMenu().subscribe({
      next: (data) => {
        this.listProcesos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar los procesos asignados';
      }
    });
  }

  private getProcesosNoAsignados(): void {
    this.menuProcesoService.getUnassignedProcesos().subscribe({
      next: (data) => {
        this.listProcesos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar los procesos no asignados';
      }
    });
  }

  private getProcesosByMenu(codm: number): void {
    this.menuProcesoService.getProcesosForMenu(codm).subscribe({
      next: (data) => {
        this.listProcesos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = `Error al cargar los procesos del menú ${codm}`;
      }
    });
  }

  trackByCodp(index: number, proceso: ProcesoDto): number {
    return proceso.codp;
  }

  esProcesoDelMenu(codp: number): boolean {
    return this.procesosDelMenu.has(codp);
  }
}
