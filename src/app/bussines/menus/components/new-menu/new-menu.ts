import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { CreateMenuRequest } from '../../models/menu.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-menu',
  imports: [FormsModule, CommonModule],
  templateUrl: './new-menu.html',
  styleUrl: './new-menu.css'
})
export class NewMenu {
  @Output() menuCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  menuName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isVisible: boolean = true;

  onSubmit(): void {
    if (!this.menuName.trim()) {
      this.errorMessage = 'El nombre del menu es requerido';
      return;
    }
    
    console.log('token: ', this.authService.getToken())
    
    if (this.menuName.trim().length < 3) {
      this.errorMessage = 'El nombre del menu debe tener al menos 3 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const menuData: CreateMenuRequest = {
      name: this.menuName.trim()
    };

    this.menuService.createMenu(menuData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.menuName = '';
        this.menuCreated.emit();
        this.closeModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear el menu. Por favor, intente nuevamente.';
        console.error('Error creating menu:', error);
      }
    });
  }

  onCancel(): void {
    this.menuName = '';
    this.errorMessage = '';
    this.cancel.emit();
    this.closeModal();
  }

  closeModal(): void {
    this.isVisible = false;
    // Opcional: Emitir evento cuando el modal se cierra completamente
    setTimeout(() => {
      this.cancel.emit();
    }, 300);
  }

  // Método para abrir el modal desde el componente padre
  open(): void {
    this.isVisible = true;
    this.menuName = '';
    this.errorMessage = '';
  }
}