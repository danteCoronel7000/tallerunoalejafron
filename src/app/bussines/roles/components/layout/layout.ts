import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { Rol, RolDto } from '../../models/rol.model';
import { CommonModule } from '@angular/common';
import { NewRol } from "../new-rol/new-rol";
import { RoleService } from '../../services/rol.service';
import { EditRol } from "../edit-rol/edit-rol";
import { RolStateService } from '../../services/rol.state.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, NewRol, EditRol],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {
  filtroValue: string = '';
  estadoSeleccionado: string = 'todos';
  showRoleModal = false;
  mensajeExito = ""
  filtroSubject = new Subject<string>();
  cargando: boolean = false;
  // Variables booleanas para controlar los modales
isModalDeshabilitarVisible: boolean = false;
isModalHabilitarVisible: boolean = false;
rolSeleccionado: RolDto | null = null;
   // Inyectar el servicio de estado
  roleState = inject(RolStateService);
  
  listRoles = signal<RolDto[]>([]);


  // Variables de paginación
  currentPage: number = 0;
  pageSize: number = 3;
  totalPages: number = 0;
  totalElements: number = 0;
  isFirst: boolean = true;
  isLast: boolean = false;

  rolService = inject(RoleService)

  // Variables de ordenamiento
  sortBy: string = 'nombre';
  sortDir: string = 'asc';

  constructor() {
    this.getRoles();
  }

  seleccionarEstado(estado: string) {
  this.estadoSeleccionado = estado;

  if (estado === 'todos') {
    this.getRoles(); // Ya lo tenés implementado
  } else {
    this.rolService.getRolesPorEstado(estado).subscribe({
      next: (data) => this.listRoles.set(data),
      error: (err) => console.error(err)
    });
  }
}

  onEnterFiltro(valor: string) {
    this.cargando = true;
    this.rolService.buscarRoles(valor).subscribe({
      next: (roles) => {
        this.listRoles.set(roles)
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar roles:', error);
        this.cargando = false;
      }
    });
  }

  limpiarFiltro(input: HTMLInputElement) {
    input.value = '';
    this.filtroValue = '';
  }

  openRoleModal(): void {
    this.showRoleModal = true;
  }

  onRoleCreated(): void {
    this.showRoleModal = false;
    // Aquí puedes actualizar la lista de roles o mostrar un mensaje de éxito
    console.log('Rol creado exitosamente');
  }

  onRoleCancel(): void {
    this.showRoleModal = false;
    console.log('Creación de rol cancelada');
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getRoles();
    }
  }

  cambiarPageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSize = parseInt(target.value);
      this.currentPage = 0;
      this.getRoles();
    }
  }

  getRoles(): void {
    this.rolService.getRolesPaginados(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortDir
    ).subscribe({
      next: (response) => {
        this.listRoles.set( response.content);
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isFirst = response.first;
        this.isLast = response.last;
        console.log('Página recibida list:', this.listRoles);
      },
      error: (err) => console.error('Error al obtener roles', err)
    });
  }

  // Abrir modal deshabilitar
abrirModalDeshabilitar(rol: any) {
  this.rolSeleccionado = rol;
  this.isModalDeshabilitarVisible = true;
}

// Cerrar modal deshabilitar
cerrarModalDeshabilitar() {
  this.isModalDeshabilitarVisible = false;
  this.rolSeleccionado = null;
}

    // Confirmar habilitar
  confirmarHabilitar() {
    console.log('Habilitando rol:', this.rolSeleccionado);
    
    this.rolService.habilitarRol(this.rolSeleccionado!.codr).subscribe({
      next: (mensaje: string) => {
        console.log('Respuesta del servidor:', mensaje);
        this.mensajeExito = mensaje;
        this.getRoles();
        this.cerrarModalHabilitar();
        // Aquí puedes agregar lógica adicional como actualizar la lista de roles
      },
      error: (error) => {
        console.error('Error al habilitar el rol:', error);
        // Manejar el error según sea necesario
      }
    });
  }

  // Confirmar deshabilitar
  confirmarDeshabilitar() {
    console.log('Deshabilitando rol:', this.rolSeleccionado);
    
    this.rolService.deshabilitarRol(this.rolSeleccionado!.codr).subscribe({
      next: (mensaje: string) => {
        console.log('Respuesta del servidor:', mensaje);
        this.mensajeExito = mensaje;
        this.getRoles();
        this.cerrarModalDeshabilitar();
        // Aquí puedes agregar lógica adicional como actualizar la lista de roles
      },
      error: (error) => {
        console.error('Error al deshabilitar el rol:', error);
        // Manejar el error según sea necesario
      }
    });
  }

// Abrir modal habilitar
abrirModalHabilitar(rol: any) {
  this.rolSeleccionado = rol;
  this.isModalHabilitarVisible = true;
}

// Cerrar modal habilitar
cerrarModalHabilitar() {
  this.isModalHabilitarVisible = false;
  this.rolSeleccionado = null;
}
  
}
