import { Component, computed, inject, signal } from '@angular/core';
import { MenuStateService } from '../../services/menu.state.service';
import { MenuService } from '../../services/menu.service';
import { UpdateMenuRequest } from '../../models/menu.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-menu',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-menu.html',
  styleUrl: './edit-menu.css'
})
export class EditMenu {
  menuState = inject(MenuStateService);
  menuService = inject(MenuService);

  // Signal local para el nombre
  menuName = signal('');

  // Computed para validación - solo para edición
  isFormValid = computed(() => this.menuName().trim().length >= 3);

  constructor() {
    // Inicializar el form con los datos del menu seleccionado
    const selectedMenu = this.menuState.selectedMenu();
    if (selectedMenu) {
      this.menuName.set(selectedMenu.nombre);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.menuState.setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validar que tenemos un menu seleccionado
    const selectedMenu = this.menuState.selectedMenu();
    if (!selectedMenu) {
      this.menuState.setError('No se ha seleccionado un menu para editar');
      return;
    }

    this.menuState.setLoading(true);

    try {
      const menuData: UpdateMenuRequest = {
        nombre: this.menuName().trim()
      };

      const menuId = selectedMenu.codm;
      await this.menuService.updateMenu(menuId, menuData).toPromise();

      this.menuState.closeModal();
      
      // Opcional: Emitir evento de actualización exitosa
      // this.menuState.menuUpdated.emit();
      
    } catch (error: any) {
      this.menuState.setError(
        error.error?.message || 'Error al actualizar el menu'
      );
    }
  }

  closeModal(): void {
    this.menuState.closeModal();
  }
}
