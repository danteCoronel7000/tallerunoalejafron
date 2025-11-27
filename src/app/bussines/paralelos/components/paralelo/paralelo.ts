import { Component, inject, signal } from '@angular/core';
import { ParaleloDto } from '../../models/paralelo.model';
import { Subject } from 'rxjs';
import { ParaleloStateService } from '../../services/paralelo.state.service';
import { ParaleloService } from '../../services/paralelo.service';
import { NewParalelo } from "../new-paralelo/new-paralelo";
import { EditParalelo } from "../edit-paralelo/edit-paralelo";

@Component({
  selector: 'app-paralelo',
  imports: [NewParalelo, EditParalelo],
  templateUrl: './paralelo.html',
  styleUrl: './paralelo.css'
})
export default class Paralelo {
  filtroValue: string = '';
estadoSeleccionado: string = 'todos';
showParaleloModal = false;
mensajeExito = ""
filtroSubject = new Subject<string>();
cargando: boolean = false;
// Variables booleanas para controlar los modales
isModalDeshabilitarVisible: boolean = false;
isModalHabilitarVisible: boolean = false;
paraleloSeleccionado: ParaleloDto | null = null;
// Inyectar el servicio de estado
paraleloState = inject(ParaleloStateService);

listParalelos = signal<ParaleloDto[]>([]);

// Variables de paginación
currentPage: number = 0;
pageSize: number = 3;
totalPages: number = 0;
totalElements: number = 0;
isFirst: boolean = true;
isLast: boolean = false;

paraleloService = inject(ParaleloService)

// Variables de ordenamiento
sortBy: string = 'nombre';
sortDir: string = 'asc';

constructor() {
  this.getParalelos();
}

seleccionarEstado(estado: string) {
  this.estadoSeleccionado = estado;

  if (estado === 'todos') {
    this.getParalelos(); // Ya lo tenés implementado
  } else {
    this.paraleloService.getParalelosPorEstado(estado).subscribe({
      next: (data) => this.listParalelos.set(data),
      error: (err) => console.error(err)
    });
  }
}

onEnterFiltro(valor: string) {
  this.cargando = true;
  this.paraleloService.buscarParalelos(valor).subscribe({
    next: (paralelos) => {
      this.listParalelos.set(paralelos)
      this.cargando = false;
    },
    error: (error) => {
      console.error('Error al buscar paralelos:', error);
      this.cargando = false;
    }
  });
}

limpiarFiltro(input: HTMLInputElement) {
  input.value = '';
  this.filtroValue = '';
}

openParaleloModal(): void {
  this.showParaleloModal = true;
}

onParaleloCreated(): void {
  this.showParaleloModal = false;
  // Aquí puedes actualizar la lista de paralelos o mostrar un mensaje de éxito
  console.log('Paralelo creado exitosamente');
  this.getParalelos();
}

onParaleloCancel(): void {
  this.showParaleloModal = false;
  console.log('Creación de paralelo cancelada');
}

cambiarPagina(page: number): void {
  if (page >= 0 && page < this.totalPages) {
    this.currentPage = page;
    this.getParalelos();
  }
}

cambiarPageSize(event: Event): void {
  const target = event.target as HTMLSelectElement;
  if (target) {
    this.pageSize = parseInt(target.value);
    this.currentPage = 0;
    this.getParalelos();
  }
}

getParalelos(): void {
  this.paraleloService.getParalelosPaginados(
    this.currentPage,
    this.pageSize,
    this.sortBy,
    this.sortDir
  ).subscribe({
    next: (response) => {
      this.listParalelos.set(response.content);
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
      this.isFirst = response.first;
      this.isLast = response.last;
      console.log('Página recibida list:', this.listParalelos);
    },
    error: (err) => console.error('Error al obtener paralelos', err)
  });
}

// Abrir modal deshabilitar
abrirModalDeshabilitar(paralelo: any) {
  this.paraleloSeleccionado = paralelo;
  this.isModalDeshabilitarVisible = true;
}

// Cerrar modal deshabilitar
cerrarModalDeshabilitar() {
  this.isModalDeshabilitarVisible = false;
  this.paraleloSeleccionado = null;
}

// Confirmar habilitar
confirmarHabilitar() {
  console.log('Habilitando paralelo:', this.paraleloSeleccionado);
  
  this.paraleloService.habilitarParalelo(this.paraleloSeleccionado!.codpar).subscribe({
    next: (mensaje: string) => {
      console.log('Respuesta del servidor:', mensaje);
      this.mensajeExito = mensaje;
      this.getParalelos();
      this.cerrarModalHabilitar();
      // Aquí puedes agregar lógica adicional como actualizar la lista de paralelos
    },
    error: (error) => {
      console.error('Error al habilitar el paralelo:', error);
      // Manejar el error según sea necesario
    }
  });
}

// Confirmar deshabilitar
confirmarDeshabilitar() {
  console.log('Deshabilitando paralelo:', this.paraleloSeleccionado);
  
  this.paraleloService.deshabilitarParalelo(this.paraleloSeleccionado!.codpar).subscribe({
    next: (mensaje: string) => {
      console.log('Respuesta del servidor:', mensaje);
      this.mensajeExito = mensaje;
      this.getParalelos();
      this.cerrarModalDeshabilitar();
      // Aquí puedes agregar lógica adicional como actualizar la lista de paralelos
    },
    error: (error) => {
      console.error('Error al deshabilitar el paralelo:', error);
      // Manejar el error según sea necesario
    }
  });
}

// Abrir modal habilitar
abrirModalHabilitar(paralelo: any) {
  this.paraleloSeleccionado = paralelo;
  this.isModalHabilitarVisible = true;
}

// Cerrar modal habilitar
cerrarModalHabilitar() {
  this.isModalHabilitarVisible = false;
  this.paraleloSeleccionado = null;
}
}
