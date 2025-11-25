import { Component, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuDto } from '../../models/menu.model';
import { MenuStateService } from '../../services/menu.state.service';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { NewRol } from "../../../roles/components/new-rol/new-rol";
import { EditRol } from "../../../roles/components/edit-rol/edit-rol";
import { NewMenu } from "../new-menu/new-menu";
import { EditMenu } from "../edit-menu/edit-menu";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, NewMenu, EditMenu],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {
  filtroValue: string = '';
  estadoSeleccionado: string = 'todos';
  showMenuModal = false;
  mensajeExito = ""
  filtroSubject = new Subject<string>();
  cargando: boolean = false;
  // Variables booleanas para controlar los modales
  isModalDeshabilitarVisible: boolean = false;
  isModalHabilitarVisible: boolean = false;
  menuSeleccionado: MenuDto | null = null;
  // Inyectar el servicio de estado
  menuState = inject(MenuStateService);
  
  listMenus = signal<MenuDto[]>([]);

  // Variables de paginación
  currentPage: number = 0;
  pageSize: number = 3;
  totalPages: number = 0;
  totalElements: number = 0;
  isFirst: boolean = true;
  isLast: boolean = false;

  menuService = inject(MenuService)

  // Variables de ordenamiento
  sortBy: string = 'nombre';
  sortDir: string = 'asc';

  constructor() {
    this.getMenus();
  }

  seleccionarEstado(estado: string) {
    this.estadoSeleccionado = estado;

    if (estado === 'todos') {
      this.getMenus(); // Ya lo tenés implementado
    } else {
      this.menuService.getMenusPorEstado(estado).subscribe({
        next: (data) => this.listMenus.set(data),
        error: (err) => console.error(err)
      });
    }
  }

  onEnterFiltro(valor: string) {
    this.cargando = true;
    this.menuService.buscarMenus(valor).subscribe({
      next: (menus) => {
        this.listMenus.set(menus)
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar menus:', error);
        this.cargando = false;
      }
    });
  }

  limpiarFiltro(input: HTMLInputElement) {
    input.value = '';
    this.filtroValue = '';
  }

  openMenuModal(): void {
    this.showMenuModal = true;
  }

  onMenuCreated(): void {
    this.showMenuModal = false;
    // Aquí puedes actualizar la lista de menus o mostrar un mensaje de éxito
    console.log('Menu creado exitosamente');
  }

  onMenuCancel(): void {
    this.showMenuModal = false;
    console.log('Creación de menu cancelada');
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getMenus();
    }
  }

  cambiarPageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSize = parseInt(target.value);
      this.currentPage = 0;
      this.getMenus();
    }
  }

  getMenus(): void {
    this.menuService.getMenusPaginados(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortDir
    ).subscribe({
      next: (response) => {
        this.listMenus.set(response.content);
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isFirst = response.first;
        this.isLast = response.last;
        console.log('Página recibida list:', this.listMenus);
      },
      error: (err) => console.error('Error al obtener menus', err)
    });
  }

  // Abrir modal deshabilitar
  abrirModalDeshabilitar(menu: any) {
    this.menuSeleccionado = menu;
    this.isModalDeshabilitarVisible = true;
  }

  // Cerrar modal deshabilitar
  cerrarModalDeshabilitar() {
    this.isModalDeshabilitarVisible = false;
    this.menuSeleccionado = null;
  }

  // Confirmar habilitar
  confirmarHabilitar() {
    console.log('Habilitando menu:', this.menuSeleccionado);
    
    this.menuService.habilitarMenu(this.menuSeleccionado!.codm).subscribe({
      next: (mensaje: string) => {
        console.log('Respuesta del servidor:', mensaje);
        this.mensajeExito = mensaje;
        this.getMenus();
        this.cerrarModalHabilitar();
        // Aquí puedes agregar lógica adicional como actualizar la lista de menus
      },
      error: (error) => {
        console.error('Error al habilitar el menu:', error);
        // Manejar el error según sea necesario
      }
    });
  }

  // Confirmar deshabilitar
  confirmarDeshabilitar() {
    console.log('Deshabilitando menu:', this.menuSeleccionado);
    
    this.menuService.deshabilitarMenu(this.menuSeleccionado!.codm).subscribe({
      next: (mensaje: string) => {
        console.log('Respuesta del servidor:', mensaje);
        this.mensajeExito = mensaje;
        this.getMenus();
        this.cerrarModalDeshabilitar();
        // Aquí puedes agregar lógica adicional como actualizar la lista de menus
      },
      error: (error) => {
        console.error('Error al deshabilitar el menu:', error);
        // Manejar el error según sea necesario
      }
    });
  }

  // Abrir modal habilitar
  abrirModalHabilitar(menu: any) {
    this.menuSeleccionado = menu;
    this.isModalHabilitarVisible = true;
  }

  // Cerrar modal habilitar
  cerrarModalHabilitar() {
    this.isModalHabilitarVisible = false;
    this.menuSeleccionado = null;
  }
}