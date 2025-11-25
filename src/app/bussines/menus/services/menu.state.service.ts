import { computed, Injectable, signal } from '@angular/core';
import { MenuDto, MenuModalState } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private state = signal<MenuModalState>({
    isOpen: false,
    selectedMenu: null,
    isLoading: false,
    error: null
  });

  public isOpen = computed(() => this.state().isOpen);
  public selectedMenu = computed(() => this.state().selectedMenu);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  // Solo método para editar (elimina openCreateModal)
  openEditModal(menu: MenuDto): void {
    this.state.update(current => ({
      ...current,
      isOpen: true,
      selectedMenu: menu,
      error: null
    }));
  }

  closeModal(): void {
    this.state.update(current => ({
      ...current,
      isOpen: false,
      selectedMenu: null,
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
