import { computed, Injectable, signal } from '@angular/core';
import { RolDto, RoleModalState } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolStateService {
   private state = signal<RoleModalState>({
    isOpen: false,
    selectedRole: null,
    isLoading: false,
    error: null
  });

  public isOpen = computed(() => this.state().isOpen);
  public selectedRole = computed(() => this.state().selectedRole);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  // Solo método para editar (elimina openCreateModal)
  openEditModal(role: RolDto): void {
    this.state.update(current => ({
      ...current,
      isOpen: true,
      selectedRole: role,
      error: null
    }));
  }

  closeModal(): void {
    this.state.update(current => ({
      ...current,
      isOpen: false,
      selectedRole: null,
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
