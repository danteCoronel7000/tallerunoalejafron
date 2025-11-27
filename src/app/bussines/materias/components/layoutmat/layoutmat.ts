import { Component, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { MateriaDto } from '../../models/materia.model';
import { MateriaStateService } from '../../services/materia.state.service';
import { MateriaService } from '../../services/materia.service';
import { EditMateria } from "../edit-materia/edit-materia";
import { NewMateria } from "../new-materia/new-materia";
import { materiasMock } from '../../mocks.ts/materia.mocks';

@Component({
  selector: 'app-layoutmat',
  imports: [EditMateria, NewMateria],
  templateUrl: './layoutmat.html',
  styleUrl: './layoutmat.css'
})
export default class Layoutmat {
filtroValue: string = '';
estadoSeleccionado: string = 'todos';
showMateriaModal = false;
mensajeExito = ""
filtroSubject = new Subject<string>();
cargando: boolean = false;
// Variables booleanas para controlar los modales
isModalDeshabilitarVisible: boolean = false;
isModalHabilitarVisible: boolean = false;
materiaSeleccionada: MateriaDto | null = null;
// Inyectar el servicio de estado
materiaState = inject(MateriaStateService);

listMaterias = signal<MateriaDto[]>([]);
// Variables de paginación
currentPage: number = 0;
pageSize: number = 3;
totalPages: number = 0;
totalElements: number = 0;
isFirst: boolean = true;
isLast: boolean = false;

materiaService = inject(MateriaService)

// Variables de ordenamiento
sortBy: string = 'nombre';
sortDir: string = 'asc';

constructor() {
  this.getMaterias();
}

seleccionarEstado(estado: string) {
  this.estadoSeleccionado = estado;

  if (estado === 'todos') {
    this.getMaterias(); // Ya lo tenés implementado
  } else {
    this.materiaService.getMateriasPorEstado(estado).subscribe({
      next: (data) => this.listMaterias.set(data),
      error: (err) => console.error(err)
    });
  }
}

onEnterFiltro(valor: string) {
  this.cargando = true;
  this.materiaService.buscarMaterias(valor).subscribe({
    next: (materias) => {
      this.listMaterias.set(materias)
      this.cargando = false;
    },
    error: (error) => {
      console.error('Error al buscar materias:', error);
      this.cargando = false;
    }
  });
}

limpiarFiltro(input: HTMLInputElement) {
  input.value = '';
  this.filtroValue = '';
}

openMateriaModal(): void {
  this.showMateriaModal = true;
}

onMateriaCreated(): void {
  this.showMateriaModal = false;
  // Aquí puedes actualizar la lista de materias o mostrar un mensaje de éxito
  console.log('Materia creada exitosamente');
}

onMateriaCancel(): void {
  this.showMateriaModal = false;
  console.log('Creación de materia cancelada');
}

cambiarPagina(page: number): void {
  if (page >= 0 && page < this.totalPages) {
    this.currentPage = page;
    this.getMaterias();
  }
}

cambiarPageSize(event: Event): void {
  const target = event.target as HTMLSelectElement;
  if (target) {
    this.pageSize = parseInt(target.value);
    this.currentPage = 0;
    this.getMaterias();
  }
}

getMaterias(): void {
  this.materiaService.getMateriasPaginadas(
    this.currentPage,
    this.pageSize,
    this.sortBy,
    this.sortDir
  ).subscribe({
    next: (response) => {
      this.listMaterias.set(response.content);
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
      this.isFirst = response.first;
      this.isLast = response.last;
      console.log('Página recibida list:', this.listMaterias);
    },
    error: (err) => console.error('Error al obtener materias', err)
  });
}

// Abrir modal deshabilitar
abrirModalDeshabilitar(materia: any) {
  this.materiaSeleccionada = materia;
  this.isModalDeshabilitarVisible = true;
}

// Cerrar modal deshabilitar
cerrarModalDeshabilitar() {
  this.isModalDeshabilitarVisible = false;
  this.materiaSeleccionada = null;
}

// Confirmar habilitar
confirmarHabilitar() {
  console.log('Habilitando materia:', this.materiaSeleccionada);
  
  this.materiaService.habilitarMateria(this.materiaSeleccionada!.codmat).subscribe({
    next: (mensaje: string) => {
      console.log('Respuesta del servidor:', mensaje);
      this.mensajeExito = mensaje;
      this.getMaterias();
      this.cerrarModalHabilitar();
      // Aquí puedes agregar lógica adicional como actualizar la lista de materias
    },
    error: (error) => {
      console.error('Error al habilitar la materia:', error);
      // Manejar el error según sea necesario
    }
  });
}

// Confirmar deshabilitar
confirmarDeshabilitar() {
  console.log('Deshabilitando materia:', this.materiaSeleccionada);
  
  this.materiaService.deshabilitarMateria(this.materiaSeleccionada!.codmat).subscribe({
    next: (mensaje: string) => {
      console.log('Respuesta del servidor:', mensaje);
      this.mensajeExito = mensaje;
      this.getMaterias();
      this.cerrarModalDeshabilitar();
      // Aquí puedes agregar lógica adicional como actualizar la lista de materias
    },
    error: (error) => {
      console.error('Error al deshabilitar la materia:', error);
      // Manejar el error según sea necesario
    }
  });
}

// Abrir modal habilitar
abrirModalHabilitar(materia: any) {
  this.materiaSeleccionada = materia;
  this.isModalHabilitarVisible = true;
}

// Cerrar modal habilitar
cerrarModalHabilitar() {
  this.isModalHabilitarVisible = false;
  this.materiaSeleccionada = null;
}

}
