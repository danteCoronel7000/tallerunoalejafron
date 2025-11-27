import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notificacion } from '../../../../core/models/notificacion.model';
import { MenuRolService } from '../../services/menu.rol.service';
import { RoleService } from '../../../roles/services/rol.service';
import { MenuService } from '../../../menus/services/menu.service';
import { RolDto } from '../../../roles/models/rol.model';
import Swal from 'sweetalert2';

type EstadoFiltro = 'todos' | 'asignados' | 'noasignados' | 'rol';

@Component({
  selector: 'app-layoutmr',
  imports: [CommonModule, FormsModule],
  templateUrl: './layoutmr.html',
  styleUrl: './layoutmr.css'
})
export default class Layoutmr {
  
  // listas
  listRoles: RolDto[] = [];
  listMenus: MenuDto[] = [];
  private contadorId = 1;
  notificaciones: Notificacion[] = [];

  estadoSeleccionado: EstadoFiltro = 'todos';
  errorMessage = '';
  menusDelRol = new Set<number>(); // IDs de menus que pertenecen al rol seleccionado
  menusRolSeleccionado: number[] = []; // IDs de menus del rol seleccionado

  // selecciones y relaciones
  rolSeleccionado: number | null = null;
  menusSeleccionados: Set<number> = new Set<number>();

  // paginación roles
  currentPageRoles = 0;
  pageSizeRoles = 3;
  totalPagesRoles = 0;
  totalElementsRoles = 0;
  isFirstRoles = true;
  isLastRoles = false;
  rolSortBy: string = 'codr';
  rolSortDir: string = 'asc';

  // paginación menus
  currentPageMenus = 0;
  pageSizeMenus = 3;
  totalPagesMenus = 0;
  totalElementsMenus = 0;
  isFirstMenus = true;
  isLastMenus = false;
  menuSortBy: string = 'codm';
  menuSortDir: string = 'asc';

  // servicios
  rolMenuService = inject(MenuRolService);
  rolService = inject(RoleService);
  menuService = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // no debes depender del constructor para lógica compleja; usamos ngOnInit
    this.getRoles();
    this.getMenus();
  }

  // === llamadas al backend ===
  getRoles(): void {
    this.rolService.getRolesPaginadosDto(
      this.currentPageRoles,
      this.pageSizeRoles,
      this.rolSortBy,
      this.rolSortDir
    ).subscribe({
      next: (response) => {
        this.listRoles = response.content;
        this.totalPagesRoles = response.totalPages;
        this.totalElementsRoles = response.totalElements;
        this.isFirstRoles = response.first;
        this.isLastRoles = response.last;
        // si estás en OnPush y no se actualiza la vista:
        this.cdr.detectChanges();
        console.log('Página recibida de roles:', response);
      },
      error: (err) => console.error('Error al obtener roles', err),
    });
  }

  getMenus(): void {
    this.menuService.getMenusPaginados(
      this.currentPageMenus,
      this.pageSizeMenus,
      this.menuSortBy,
      this.menuSortDir
    ).subscribe({
      next: (response) => {
        this.listMenus = response.content || [];
        this.totalPagesMenus = response.totalPages ?? 0;
        this.totalElementsMenus = response.totalElements ?? 0;
        this.isFirstMenus = response.first ?? (this.currentPageMenus === 0);
        this.isLastMenus = response.last ?? (this.currentPageMenus >= (this.totalPagesMenus - 1));
        this.cdr.detectChanges();
        console.log('Página recibida de menus:', response);
      },
      error: (err) => console.error('Error al obtener menus', err),
    });
  }

  // === trackBy para ngFor ===
  trackByCodr(index: number, item: RolDto) {
    return item.codr;
  }

  // === selección rol ===
  seleccionarRol(codr: number): void {
    this.rolSeleccionado = codr;
    // Luego marcar los del rol
    setTimeout(() => {
      this.estadoSeleccionado = 'rol';
      this.filtrarByEstado('rol');
    }, 100);
  }

  // === toggle menus seleccionados (Set) ===
  toggleSeleccionMenu(codm: number): void {
    if (this.menusSeleccionados.has(codm)) {
      this.menusSeleccionados.delete(codm);
    } else {
      this.menusSeleccionados.add(codm);
    }
    // detectChanges en caso de OnPush
    this.cdr.detectChanges();
  }

  // === paginación roles: ahora llama a getRoles() ===
  cambiarPaginaRoles(page: number): void {
    if (page >= 0 && page < this.totalPagesRoles) {
      this.currentPageRoles = page;
      this.getRoles();
    }
  }

  cambiarPageSizeRoles(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSizeRoles = parseInt(target.value, 10);
      this.currentPageRoles = 0;
      this.getRoles();
    }
  }

  // === paginación menus (ya estaba bien, lo dejamos) ===
  cambiarPaginaMenus(page: number): void {
    if (page >= 0 && page < this.totalPagesMenus) {
      this.currentPageMenus = page;
      this.getMenus();
    }
  }

  cambiarPageSizeMenus(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSizeMenus = parseInt(target.value, 10);
      this.currentPageMenus = 0;
      this.getMenus();
    }
  }

  asignarMenusARol() {
    if (!this.rolSeleccionado || this.menusSeleccionados.size === 0) {
      console.log('Debe seleccionar un rol y al menos un menu');
      return;
    }
    const dto: AsignarMenusRolDTO = {
      rolId: this.rolSeleccionado,
      menusIds: Array.from(this.menusSeleccionados)
    };

    console.log('dto de asignar menus rol',dto)

    this.rolMenuService.asignarMenus(dto).subscribe({
      next: () => {
        console.log("Menus asignados correctamente");
        Swal.fire(
          '¡Exito!',
          `Menus asignados correctamente.`,
          'success'
        );
      },
      error: (err) => {
        console.error("Error asignando menus:", err);
        // ❌ LLAMAR NOTIFICACIÓN DE ERROR
        Swal.fire('Error', 'Fallo al asignar menus al rol.', 'error');
      }
    });
  }

  // Método opcional para limpiar selección
  limpiarSeleccion() {
    this.rolSeleccionado = null;
    this.menusSeleccionados.clear();
  }
  
  desasignarMenusARol() {
    if (!this.rolSeleccionado || this.menusSeleccionados.size === 0) {
      console.log('Debe seleccionar un rol y al menos un menu');
      return;
    }

    // Confirmación antes de desasignar
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a desasignar los menus seleccionados del rol",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dto: AsignarMenusRolDTO = {
          rolId: this.rolSeleccionado!,
          menusIds: Array.from(this.menusSeleccionados)
        };

        this.rolMenuService.desasignarMenus(dto).subscribe({
          next: () => {
            console.log("Menus desasignados correctamente");
            Swal.fire(
              '¡Éxito!',
              `Menus desasignados correctamente.`,
              'success'
            );
            this.limpiarSeleccion();
          },
          error: (err) => {
            console.error("Error desasignando menus:", err);
            Swal.fire('Error', 'Fallo al desasignar menus al rol.', 'error');
          }
        });
      }
    });
  }
  
  onEnterFiltroMenu(valor: string) {
    this.menuService.buscarMenus(valor).subscribe({
      next: (menus) => {
        this.listMenus = menus
        this.cdr.detectChanges(); // fuerza renderizado
      },
      error: (error) => {
        console.error('Error al buscar menus:', error);
      }
    });
  }

  onEnterFiltroRol(valor: string) {
    console.log("valor:::: ", valor)
    this.rolMenuService.buscarRoles(valor).subscribe({
      next: (roles) => {
        this.listRoles = roles; // fuerza cambio
        console.log('roles busc: ', roles)
        console.log('roles busc: ', this.listRoles)
        this.cdr.detectChanges(); // fuerza renderizado
      },
      error: (error) => {
        console.error('Error al buscar roles:', error);
      }
    });
  }

  // Método principal mejorado con switch
  filtrarByEstado(estado: EstadoFiltro): void {
    this.estadoSeleccionado = estado;
    this.errorMessage = '';

    switch (estado) {
      case 'todos':
        this.getMenus();
        break;

      case 'asignados':
        this.getMenusAsignados();
        break;

      case 'noasignados':
        this.getMenusNoAsignados();
        break;

      case 'rol':
        if (this.rolSeleccionado) {
          this.getMenusByRol(this.rolSeleccionado);
        } else {
          this.errorMessage = 'Por favor, seleccione un rol primero';
        }
        break;

      default:
        this.getMenus();
    }
  }

  // Verificar si un menu está seleccionado/marcado
  isMenuMarcado(codm: number): boolean {
    return this.menusRolSeleccionado.includes(codm);
  }

  // Obtener menus asignados a cualquier rol
  private getMenusAsignados(): void {
    this.rolMenuService.getMenusAssignedToAnyRol().subscribe({
      next: (data) => {
        this.listMenus = data;
        console.log('obtenidos asignados:', data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener menus asignados:', error);
        this.errorMessage = 'Error al cargar los menus asignados';
      }
    });
  }

   // Obtener menus NO asignados a ningún rol
  private getMenusNoAsignados(): void {
    this.rolMenuService.getUnassignedMenus().subscribe({
      next: (data) => {
        this.listMenus = data;
        console.log('obtenidos NO asignado :', data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener menus no asignados:', error);
        this.errorMessage = 'Error al cargar los menus no asignados';
      }
    });
  }

  // Obtener menus de un rol específico
  private getMenusByRol(codr: number): void {
    this.rolMenuService.getMenusForRol(codr).subscribe({
      next: (data) => {
        this.listMenus = data;
        console.log('obtenidos asignado a rol:', data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener menus del rol:', error);
        this.errorMessage = `Error al cargar los menus del rol ${codr}`;
      }
    });
  }

  // TrackBy para optimizar el renderizado
  trackByCodm(index: number, menu: MenuDto): number {
    return menu.codm;
  }

  // Verificar si un menu pertenece al rol seleccionado
  esMenuDelRol(codm: number): boolean {
    return this.menusDelRol.has(codm);
  }
}
