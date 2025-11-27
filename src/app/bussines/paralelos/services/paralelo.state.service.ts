import { computed, Injectable, signal } from '@angular/core';
import { ParaleloDto, ParaleloModalState } from '../models/paralelo.model';

@Injectable({
  providedIn: 'root'
})
export class ParaleloStateService {
  private state = signal<ParaleloModalState>({
    isOpen: false,
    selectedParalelo: null,
    isLoading: false,
    error: null
  });

  public isOpen = computed(() => this.state().isOpen);
  public selectedParalelo = computed(() => this.state().selectedParalelo);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  // Solo método para editar (elimina openCreateModal)
  openEditModal(paralelo: ParaleloDto): void {
    this.state.update(current => ({
      ...current,
      isOpen: true,
      selectedParalelo: paralelo,
      error: null
    }));
  }

  closeModal(): void {
    this.state.update(current => ({
      ...current,
      isOpen: false,
      selectedParalelo: null,
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