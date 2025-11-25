import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RoleService } from '../../services/rol.service';
import { CreateRoleRequest } from '../../models/rol.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-new-rol',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-rol.html',
  styleUrl: './new-rol.css'
})
export class NewRol {
   @Output() roleCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private roleService = inject(RoleService);
  private authService = inject(AuthService);

  roleName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isVisible: boolean = true;

  onSubmit(): void {
    if (!this.roleName.trim()) {
      this.errorMessage = 'El nombre del rol es requerido';
      return;
    }
    
    console.log('token: ', this.authService.getToken())
    
    if (this.roleName.trim().length < 3) {
      this.errorMessage = 'El nombre del rol debe tener al menos 3 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const roleData: CreateRoleRequest = {
      name: this.roleName.trim()
    };

    this.roleService.createRole(roleData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.roleName = '';
        this.roleCreated.emit();
        this.closeModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear el rol. Por favor, intente nuevamente.';
        console.error('Error creating role:', error);
      }
    });
  }

  onCancel(): void {
    this.roleName = '';
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
    this.roleName = '';
    this.errorMessage = '';
  }
}

