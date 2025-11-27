import { computed, Injectable, signal } from '@angular/core';
import { MateriaDto, MateriaModalState } from '../models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaStateService {
  private state = signal<MateriaModalState>({
    isOpen: false,
    selectedMateria: null,
    isLoading: false,
    error: null
  });

  public isOpen = computed(() => this.state().isOpen);
  public selectedMateria = computed(() => this.state().selectedMateria);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  // Solo método para editar (elimina openCreateModal)
  openEditModal(materia: MateriaDto): void {
    this.state.update(current => ({
      ...current,
      isOpen: true,
      selectedMateria: materia,
      error: null
    }));
  }

  closeModal(): void {
    this.state.update(current => ({
      ...current,
      isOpen: false,
      selectedMateria: null,
      error: null,
      isLoading: false
    }));
  }

  setLoading(loading: boolean): void {
    this.state.update(current => ({
      ...current,
      isLoading: loading
    }));
  }

  setError(error: string): void {
    this.state.update(current => ({
      ...current,
      error,
      isLoading: false
    }));
  }
}